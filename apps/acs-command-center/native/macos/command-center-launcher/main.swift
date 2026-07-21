import AppKit
import Foundation

private let commandCenterURL = URL(string: "https://acs-command-center.onemanband87.chatgpt.site")!
private let pendingDirectory = FileManager.default.homeDirectoryForCurrentUser
    .appendingPathComponent("Library/Application Support/NEURO-DIV/Universal Intake/Pending", isDirectory: true)
private let stagingDirectory = FileManager.default.homeDirectoryForCurrentUser
    .appendingPathComponent("Library/Application Support/NEURO-DIV/Universal Intake/Staging", isDirectory: true)

@MainActor
final class IntakeServiceProvider: NSObject {
    var handledService = false

    @objc func sendToNeuroDiv(
        _ pasteboard: NSPasteboard,
        userData: String,
        error: AutoreleasingUnsafeMutablePointer<NSString?>
    ) {
        handledService = true

        do {
            try FileManager.default.createDirectory(
                at: pendingDirectory,
                withIntermediateDirectories: true,
                attributes: [.posixPermissions: 0o700]
            )
            try FileManager.default.createDirectory(
                at: stagingDirectory,
                withIntermediateDirectories: true,
                attributes: [.posixPermissions: 0o700]
            )

            let copiedCount = try routePasteboard(pasteboard)
            guard copiedCount > 0 else {
                error.pointee = "No supported file, URL, or text was available to send." as NSString
                NSSound.beep()
                return
            }
        } catch let routingError {
            error.pointee = "Send to NEURO-DIV failed: \(routingError.localizedDescription)" as NSString
            NSSound.beep()
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            NSApplication.shared.terminate(nil)
        }
    }

    private func routePasteboard(_ pasteboard: NSPasteboard) throws -> Int {
        var routed = 0
        var seen = Set<String>()

        let readableTypes: [NSPasteboard.PasteboardType] = [.fileURL, .URL]
        for type in readableTypes {
            guard let values = pasteboard.readObjects(
                forClasses: [NSURL.self],
                options: [.urlReadingFileURLsOnly: type == .fileURL]
            ) as? [URL] else { continue }

            for source in values where seen.insert(source.absoluteString).inserted {
                if source.isFileURL {
                    try copyFile(source)
                } else {
                    try writeText(source.absoluteString, suffix: "url")
                }
                routed += 1
            }
        }

        if routed == 0, let text = pasteboard.string(forType: .string), !text.isEmpty {
            try writeText(text, suffix: "text")
            routed = 1
        }

        return routed
    }

    private func copyFile(_ source: URL) throws {
        let values = try source.resourceValues(forKeys: [.isDirectoryKey])
        if values.isDirectory == true {
            let archiveName = uniqueName(base: source.lastPathComponent, extension: "zip")
            let stagedArchive = stagingDirectory.appendingPathComponent(archiveName)
            let process = Process()
            process.executableURL = URL(fileURLWithPath: "/usr/bin/ditto")
            process.arguments = ["-c", "-k", "--sequesterRsrc", "--keepParent", source.path, stagedArchive.path]
            try process.run()
            process.waitUntilExit()
            guard process.terminationStatus == 0 else {
                throw NSError(domain: "org.neuro-div.ccs", code: Int(process.terminationStatus), userInfo: [
                    NSLocalizedDescriptionKey: "The selected folder could not be packaged for intake."
                ])
            }
            try publish(stagedArchive)
            return
        }

        let stagedFile = stagingDirectory.appendingPathComponent(
            uniqueName(base: source.deletingPathExtension().lastPathComponent, extension: source.pathExtension)
        )
        try FileManager.default.copyItem(at: source, to: stagedFile)
        try publish(stagedFile)
    }

    private func writeText(_ text: String, suffix: String) throws {
        let stagedFile = stagingDirectory.appendingPathComponent(
            "Shared to NEURO-DIV - \(timestamp()) - \(UUID().uuidString.prefix(8)).\(suffix).txt"
        )
        try text.write(to: stagedFile, atomically: true, encoding: .utf8)
        try publish(stagedFile)
    }

    private func publish(_ stagedFile: URL) throws {
        let destination = pendingDirectory.appendingPathComponent(stagedFile.lastPathComponent)
        try FileManager.default.moveItem(at: stagedFile, to: destination)
        try triggerRouter()
    }

    private func triggerRouter() throws {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/bin/launchctl")
        process.arguments = [
            "kickstart",
            "gui/\(getuid())/org.neuro-div.acs.universal-intake"
        ]
        try process.run()
        process.waitUntilExit()
        guard process.terminationStatus == 0 else {
            throw NSError(domain: "org.neuro-div.ccs", code: Int(process.terminationStatus), userInfo: [
                NSLocalizedDescriptionKey: "The CCS intake router could not be started."
            ])
        }
    }

    private func uniqueName(base: String, extension fileExtension: String) -> String {
        let cleanBase = base.isEmpty ? "Shared item" : base
        let suffix = fileExtension.isEmpty ? "" : ".\(fileExtension)"
        return "\(cleanBase) - \(timestamp()) - \(UUID().uuidString.prefix(8))\(suffix)"
    }

    private func timestamp() -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyyMMdd-HHmmss"
        return formatter.string(from: Date())
    }
}

@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate {
    private let serviceProvider = IntakeServiceProvider()

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApplication.shared.servicesProvider = serviceProvider
        NSUpdateDynamicServices()
        NSWorkspace.shared.open(commandCenterURL)
    }
}

@main
@MainActor
struct CommandCenterApplication {
    static func main() {
        let application = NSApplication.shared
        let delegate = AppDelegate()
        application.delegate = delegate
        application.setActivationPolicy(.accessory)
        application.run()
    }
}

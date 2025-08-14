import { UpgradeInteractiveCommand as OriginalUpgradeInteractiveCommand } from "@yarnpkg/plugin-interactive-tools";
import { Option } from "clipanion";
import { Configuration, Project, Workspace } from "@yarnpkg/core";
import { PortablePath } from "@yarnpkg/fslib";

export class UpgradeInteractiveCommand extends OriginalUpgradeInteractiveCommand {
  workspaces = Option.Rest({
    required: 1,
  });

  static paths = [["upgrade-interactive-filter"]];

  async execute(): Promise<0 | 1> {
    if (!this.workspaces || this.workspaces.length === 0) {
      return super.execute();
    }

    // Store original Project.find
    const originalProjectFind = Project.find;

    // Override Project.find with workspace filtering
    Project.find = async (
      configuration: Configuration,
      startingCwd: PortablePath
    ) => {
      const { project, ...rest } = await originalProjectFind.call(
        Project,
        configuration,
        startingCwd
      );

      // Create filtered project - only include selected workspaces
      const filteredProject = this.createFilteredProject(
        project,
        this.workspaces
      );

      return { ...rest, project: filteredProject };
    };

    try {
      return await super.execute();
    } finally {
      Project.find = originalProjectFind;
    }
  }

  private createFilteredProject(
    originalProject: Project,
    workspaceNames: string[] | undefined
  ): Project {
    const selectedWorkspaceNames = new Set(workspaceNames);
    const filteredWorkspaces: Workspace[] = [];

    for (const workspace of originalProject.workspaces) {
      const workspaceName =
        workspace.manifest.name?.name || workspace.relativeCwd;

      // Include if exact match
      if (selectedWorkspaceNames.has(workspaceName)) {
        filteredWorkspaces.push(workspace);
        continue;
      }

      // Include if nested inside any selected workspace
      for (const selectedName of selectedWorkspaceNames) {
        const selectedWorkspace = Array.from(originalProject.workspaces).find(
          (ws) => (ws.manifest.name?.name || ws.relativeCwd) === selectedName
        );

        if (
          selectedWorkspace &&
          workspace.relativeCwd.startsWith(selectedWorkspace.relativeCwd + "/")
        ) {
          filteredWorkspaces.push(workspace);
          break;
        }
      }
    }

    console.log(
      "filtered workspaces:",
      filteredWorkspaces.map((w) => w.manifest.name?.name || w.relativeCwd)
    );

    // Create a proxy that inherits from original project but overrides workspaces
    return new Proxy(originalProject, {
      get(target, prop) {
        if (prop === "workspaces") {
          return filteredWorkspaces;
        }
        return target[prop as keyof Project];
      },
    });
  }
}

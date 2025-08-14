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
      const workspaceName = workspace.manifest.name?.name;

      // Only include workspaces with package names that match exactly
      if (workspaceName && selectedWorkspaceNames.has(workspaceName)) {
        filteredWorkspaces.push(workspace);
      }
    }

    console.log(
      "filtered workspaces:",
      filteredWorkspaces.map((w) => w.manifest.name?.name)
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

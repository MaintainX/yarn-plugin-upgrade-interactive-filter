import { UpgradeInteractiveCommand as OriginalUpgradeInteractiveCommand } from "@yarnpkg/plugin-interactive-tools";
import { Option } from "clipanion";
import { Configuration, Project, Workspace, structUtils } from "@yarnpkg/core";
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
    if (!workspaceNames) return originalProject;

    // Convert user-provided workspace names to identHashes
    const selectedIdentHashes = new Set(
      workspaceNames.map((name) => structUtils.parseIdent(name).identHash)
    );
    const filteredWorkspaces: Workspace[] = [];

    for (const workspace of originalProject.workspaces) {
      const workspaceIdentHash = workspace.manifest.name?.identHash;

      // Only include workspaces with identHash that match exactly
      if (workspaceIdentHash && selectedIdentHashes.has(workspaceIdentHash)) {
        filteredWorkspaces.push(workspace);
      }
    }

    console.log(
      "filtered workspaces:",
      filteredWorkspaces.map((w) =>
        structUtils.stringifyIdent(w.manifest.name!)
      )
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

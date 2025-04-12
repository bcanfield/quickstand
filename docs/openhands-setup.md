# Setting Up OpenHands GitHub Action

This document provides instructions for setting up and using the OpenHands GitHub Action in the Quickstand repository. This integration allows AI to automatically attempt to resolve GitHub issues.

## Prerequisites

Before setting up the OpenHands GitHub Action, ensure you have:

1. GitHub account with admin access to this repository
2. An API key for Claude or another supported LLM service

## Step 1: Create a Personal Access Token

1. Go to your GitHub account settings → [Developer Settings](https://github.com/settings/tokens) → Personal Access Tokens
2. Create a fine-grained token with these permissions:
   - "Contents" (read/write)
   - "Issues" (read/write)
   - "Pull requests" (read/write)
   - "Workflows" (read/write)
3. Save the token securely for the next steps

## Step 2: Configure Repository Permissions

1. Go to the Quickstand repository settings
2. Navigate to "Settings" → "Actions" → "General" → "Workflow permissions"
3. Select "Read and write permissions"
4. Enable "Allow GitHub Actions to create and approve pull requests"
5. Save the changes

## Step 3: Set Up GitHub Secrets

1. Go to the Quickstand repository settings
2. Navigate to "Settings" → "Secrets and variables" → "Actions"
3. Add these secrets:
   - `LLM_API_KEY`: Your Claude API key (required)
   - `PAT_USERNAME`: Your GitHub username (optional)
   - `PAT_TOKEN`: Your personal access token from Step 1 (optional)
   - `LLM_BASE_URL`: Only needed if using a proxy (optional)

## Using the OpenHands Agent

You can use the OpenHands agent in two ways:

1. **Using the 'fix-me' label**:
   - Add the 'fix-me' label to any issue you want the AI to resolve
   - The workflow will automatically attempt to fix it and create a draft PR
   - Example: Add the 'fix-me' label to issue #42

2. **Using `@openhands-agent` mention**:
   - Comment on any issue with `@openhands-agent` to trigger the agent
   - The agent will attempt to resolve the issue based on your comment
   - Example: Comment "@openhands-agent Please implement this feature following our CQRS pattern"

## Workflow Details

The OpenHands GitHub Action workflow:
1. Runs when an issue is labeled with 'fix-me' or when a comment mentions `@openhands-agent`
2. Uses Claude AI to analyze the issue and attempt to resolve it
3. Creates a draft PR with the proposed solution if successful
4. Comments on the issue with the results
5. Removes the 'fix-me' label once processed

## Customization

The AI agent is guided by the `.openhands_instructions` file in the root of the repository. This file contains project-specific instructions that help the agent understand:

- Quickstand's project structure
- Coding standards and architecture patterns
- CLI command and service implementation patterns
- Testing guidelines

To update these instructions, simply edit the `.openhands_instructions` file.

## Troubleshooting

If you encounter issues with the OpenHands GitHub Action:

1. Check the GitHub Actions logs for error messages
2. Verify that all required secrets are properly set
3. Ensure the repository permissions are correctly configured
4. Check that the issue is properly labeled or that `@openhands-agent` is mentioned correctly 
#!/bin/bash

# Check GitHub Actions status for the repository

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) is not installed. Please install it first:"
    echo "  https://cli.github.com/"
    exit 1
fi

# Check if we're authenticated
if ! gh auth status &> /dev/null; then
    print_error "Not authenticated with GitHub. Please run 'gh auth login' first."
    exit 1
fi

# Get repository info
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
print_info "Checking status for repository: $REPO"

# Get latest workflow runs
echo ""
print_info "Latest workflow runs:"
gh run list --limit 5

echo ""
print_info "Workflow status summary:"

# Check each workflow
WORKFLOWS=("CI" "Quality" "Deploy" "Dependency Check" "Validate")

for workflow in "${WORKFLOWS[@]}"; do
    # Get the latest run for this workflow
    RUN=$(gh run list --workflow="$workflow.yml" --limit 1 --json status,conclusion,createdAt,url -q '.[0]')

    if [ "$RUN" = "null" ] || [ -z "$RUN" ]; then
        print_warning "$workflow: No runs found"
        continue
    fi

    STATUS=$(echo "$RUN" | jq -r '.status')
    CONCLUSION=$(echo "$RUN" | jq -r '.conclusion')
    CREATED=$(echo "$RUN" | jq -r '.createdAt')
    URL=$(echo "$RUN" | jq -r '.url')

    if [ "$STATUS" = "completed" ] && [ "$CONCLUSION" = "success" ]; then
        print_status "$workflow: ✅ Success"
    elif [ "$STATUS" = "completed" ] && [ "$CONCLUSION" = "failure" ]; then
        print_error "$workflow: ❌ Failed"
        echo "    URL: $URL"
    elif [ "$STATUS" = "in_progress" ]; then
        print_warning "$workflow: ⏳ In Progress"
    else
        print_warning "$workflow: ⚠️  $STATUS ($CONCLUSION)"
    fi
done

echo ""
print_info "To view detailed logs, run:"
echo "  gh run view [run-id]"
echo "  gh run list --workflow=[workflow-name].yml"

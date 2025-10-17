#!/bin/bash

# Local CI script - run all checks locally before pushing

set -e

echo "🚀 Running local CI checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci
print_status "Dependencies installed"

# Type checking
echo "🔍 Running TypeScript type check..."
npx tsc --noEmit
print_status "TypeScript type check passed"

# Run tests
echo "🧪 Running tests..."
npm test
print_status "Tests passed"

# Run tests with coverage
echo "📊 Running tests with coverage..."
npm run test:coverage
print_status "Test coverage completed"

# Build project
echo "🏗️  Building project..."
npm run build
print_status "Build successful"

# Check for console.log statements
echo "🔍 Checking for console.log statements..."
if grep -r "console\.log" src/ --include="*.ts" --include="*.tsx"; then
    print_warning "console.log statements found in source code"
    echo "Consider removing them before production"
else
    print_status "No console.log statements found"
fi

# Check for TODO/FIXME comments
echo "🔍 Checking for TODO/FIXME comments..."
TODO_COUNT=$(grep -r "TODO\|FIXME" src/ --include="*.ts" --include="*.tsx" | wc -l)
if [ $TODO_COUNT -gt 0 ]; then
    print_warning "Found $TODO_COUNT TODO/FIXME comments"
    grep -r "TODO\|FIXME" src/ --include="*.ts" --include="*.tsx"
else
    print_status "No TODO/FIXME comments found"
fi

# Check bundle size
echo "📦 Checking bundle size..."
if [ -d "dist" ]; then
    BUNDLE_SIZE=$(du -sh dist/ | cut -f1)
    echo "Bundle size: $BUNDLE_SIZE"

    # Check for large files (>1MB)
    LARGE_FILES=$(find dist/ -type f -size +1M 2>/dev/null || true)
    if [ -n "$LARGE_FILES" ]; then
        print_warning "Large files found:"
        echo "$LARGE_FILES"
    else
        print_status "No large files found"
    fi
else
    print_error "dist directory not found. Build may have failed."
    exit 1
fi

# Security audit
echo "🔒 Running security audit..."
npm audit --audit-level moderate || print_warning "Security audit found issues"

# Check for outdated packages
echo "📦 Checking for outdated packages..."
npm outdated || print_warning "Some packages are outdated"

echo ""
print_status "All CI checks completed successfully! 🎉"
echo "You can now safely push your changes."

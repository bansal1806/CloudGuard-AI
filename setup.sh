#!/bin/bash

echo ""
echo "========================================"
echo "   CloudGuard AI - Setup Script"
echo "========================================"
echo ""

echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo ""
echo "Starting Docker services..."
docker-compose up -d
if [ $? -ne 0 ]; then
    echo "Warning: Docker services may not be available"
    echo "You can continue without Docker for frontend-only demo"
fi

echo ""
echo "Generating Prisma client..."
npm run db:generate
if [ $? -ne 0 ]; then
    echo "Warning: Database setup failed, continuing with mock data"
fi

echo ""
echo "========================================"
echo "   Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Run: npm run dev"
echo "  2. Open: http://localhost:3000"
echo "  3. Enjoy the CloudGuard AI demo!"
echo ""
echo "For Docker services:"
echo "  - Grafana: http://localhost:3001"
echo "  - Prometheus: http://localhost:9090"
echo ""

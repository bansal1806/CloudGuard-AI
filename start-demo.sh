#!/bin/bash

echo "========================================"
echo "CloudGuard AI - Real-Time Data Demo"
echo "FOR JUDGES: Cost-Effective Monitoring"
echo "========================================"
echo

echo "Starting Docker services..."
docker-compose up -d

echo
echo "Installing dependencies..."
npm install

echo
echo "Starting real-time data collection..."
npm run dev &

sleep 5

echo
echo "========================================"
echo "DEMO READY FOR JUDGES"
echo "========================================"
echo "Dashboard: http://localhost:3000"
echo "API Demo: http://localhost:3000/api/judge-demo"
echo "Cost Analysis: http://localhost:3000/api/judge-demo?demo=cost-analysis"
echo "Real-Time Proof: http://localhost:3000/api/judge-demo?demo=real-time-proof"
echo "========================================"
echo

# Keep script running
wait

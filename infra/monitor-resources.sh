#!/bin/bash

# Resource monitoring script for low-memory AWS Lightsail
# Usage: ./monitor-resources.sh

echo "🔍 Biplace Booking Resource Monitor"
echo "=================================="
echo ""

# System resources
echo "💽 System Resources:"
echo "  RAM Usage: $(free -h | awk 'NR==2{printf "%.1f/%.1fGB (%.1f%%)", $3/1024/1024, $2/1024/1024, $3*100/$2}')"
echo "  CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')%"
echo "  Disk Usage: $(df -h / | awk 'NR==2{print $3"/"$2" ("$5")"}')"
echo ""

# Docker stats if containers are running
if docker-compose ps -q > /dev/null 2>&1; then
    echo "🐳 Docker Container Resources:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" $(docker-compose ps -q) 2>/dev/null || echo "  No running containers"
    echo ""
fi

# Memory breakdown
echo "📊 Memory Breakdown:"
echo "  Available: $(free -h | awk 'NR==2{print $7}')"
echo "  Buffers/Cache: $(free -h | awk 'NR==2{print $6}')"
echo "  Swap: $(free -h | awk 'NR==3{print $3"/"$2}')"
echo ""

# Top processes by memory
echo "🔝 Top Memory Users:"
ps aux --sort=-%mem | head -6 | awk 'NR==1{print "  PID\tUSER\t%MEM\tCOMMAND"} NR>1{printf "  %s\t%s\t%s\t%s\n", $2, $1, $4, $11}'
echo ""

# Disk space
echo "💾 Disk Usage:"
echo "  Docker volumes: $(du -sh /var/lib/docker/volumes 2>/dev/null | awk '{print $1}' || echo 'N/A')"
echo "  Docker images: $(docker system df 2>/dev/null | grep Images | awk '{print $3}' || echo 'N/A')"
echo ""

# Warnings
echo "⚠️  Resource Allocation (512MB Server):"
echo "  Staging Total: ~176M (postgres:64M + backend:80M + caddy:32M)"
echo "  Production Total: ~704M (postgres:256M + backend:320M + caddy:128M)"
echo "  ⚠️  IMPORTANT: Cannot run both environments simultaneously!"
echo "  💡 Stop staging before deploying production: pnpm docker:down"
echo ""

echo "🚨 Current Warnings:"
AVAILABLE_MB=$(free -m | awk 'NR==2{print $7}')
if [ "$AVAILABLE_MB" -lt 50 ]; then
    echo "  🚨 LOW MEMORY: Only ${AVAILABLE_MB}MB available!"
fi

DISK_USAGE=$(df / | awk 'NR==2{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    echo "  🚨 LOW DISK SPACE: ${DISK_USAGE}% used!"
fi

# Check if too many containers are running
CONTAINER_COUNT=$(docker ps -q | wc -l)
if [ "$CONTAINER_COUNT" -gt 3 ]; then
    echo "  ⚠️  Multiple containers detected ($CONTAINER_COUNT). Consider stopping staging."
fi

echo ""
echo "💡 Tips:"
echo "  - Monitor with: watch -n 5 ./monitor-resources.sh"
echo "  - Clean up: docker system prune -f"
echo "  - Restart if needed: pnpm docker:down && pnpm docker:staging"
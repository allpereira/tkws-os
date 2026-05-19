#!/usr/bin/env bash
# ============================================
# Provisiona uma VM EC2 (Amazon Linux 2023 ou Ubuntu 24) recém-criada
# para rodar o TKWS OS.
# Uso: ssh ec2-user@host 'bash -s' < scripts/provision-vm.sh
# ============================================

set -euo pipefail

echo "==> Atualizando sistema..."
if command -v dnf >/dev/null; then
    sudo dnf update -y
    sudo dnf install -y git curl unzip
elif command -v apt >/dev/null; then
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y git curl unzip ca-certificates
fi

echo "==> Instalando Docker..."
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

echo "==> Instalando Docker Compose plugin..."
DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
ARCH=$(uname -m)
case $ARCH in
    x86_64) COMPOSE_ARCH="x86_64" ;;
    aarch64) COMPOSE_ARCH="aarch64" ;;
    *) echo "Arch não suportada: $ARCH"; exit 1 ;;
esac
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-${COMPOSE_ARCH}" \
    -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

echo "==> Criando diretório do projeto..."
sudo mkdir -p /opt/tkws-os
sudo chown $USER:$USER /opt/tkws-os

echo "==> Configurando firewall (UFW se Ubuntu)..."
if command -v ufw >/dev/null; then
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
fi

echo "==> Configurando swap (importante pra VM pequena)..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo ""
echo "============================================"
echo "✓ VM provisionada com sucesso!"
echo ""
echo "Próximos passos:"
echo "  1. Faça logout/login pra ativar grupo docker"
echo "  2. Clone o repo em /opt/tkws-os"
echo "  3. Crie o .env.staging ou .env.prod"
echo "  4. docker compose -f docker-compose.prod.yml --env-file .env.prod up -d"
echo "============================================"

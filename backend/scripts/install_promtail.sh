#!/bin/bash
set -e

PROMTAIL_VERSION="2.9.2"
CONFIG_PATH="/etc/promtail/config.yaml"

echo "=== Installing Promtail ==="

sudo apt-get update -y || true
sudo apt-get install -y wget unzip || true
sudo apk update || true
sudo apk add wget unzip || true

wget https://github.com/grafana/loki/releases/download/v$PROMTAIL_VERSION/promtail-linux-amd64.zip
unzip promtail-linux-amd64.zip
chmod +x promtail-linux-amd64

sudo mv promtail-linux-amd64 /usr/local/bin/promtail

sudo mkdir -p /etc/promtail

echo "$PROMTAIL_CONFIG" | sudo tee $CONFIG_PATH > /dev/null

sudo bash -c 'cat <<EOF > /etc/systemd/system/promtail.service
[Unit]
Description=Promtail Service
After=network.target

[Service]
ExecStart=/usr/local/bin/promtail -config.file /etc/promtail/config.yaml
Restart=always
RestartSec=2

[Install]
WantedBy=multi-user.target
EOF'

sudo systemctl daemon-reload
sudo systemctl enable promtail
sudo systemctl restart promtail

echo "Promtail installed and running."

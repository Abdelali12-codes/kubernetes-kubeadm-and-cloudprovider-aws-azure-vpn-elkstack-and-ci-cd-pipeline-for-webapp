# Set up the hostname

sudo hostnamectl set-hostname \
$(curl -s http://169.254.169.254/latest/meta-data/local-hostname)

# Disable swap

# sudo swapoff -a
# sudo sed -i.bak -r 's/(.+ swap .+)/#\1/' /etc/fstab

# install kubelet, kubeadm and kubectl 

sudo apt-get update && sudo apt-get install -y apt-transport-https curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
cat <<EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# Install Docker and change the cgroup driver to systemd.

sudo apt install docker.io -y

sudo cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF

sudo systemctl restart docker
sudo systemctl enable docker


# edit this file /etc/systemd/system/kubelet.service.d/10-kubeadm.conf

# add this line to it --cloud-provider=aws

# Initiate the kubeadm kubeadm init --config /etc/kubernetes/aws.yml

# on the worker node create node.yml file under /etc/kubernetes/node.yml

# run the command sudo kubeadm join --config /etc/kubernetes/node.yml

# Once the configuration has been made, reset the kubelet daemon.

# run this command systemctl daemon-reload

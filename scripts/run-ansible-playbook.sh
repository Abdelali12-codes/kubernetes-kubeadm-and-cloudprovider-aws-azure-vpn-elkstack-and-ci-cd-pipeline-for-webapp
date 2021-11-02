cd /home/azureuser/devops/ansible
ansible-playbook ansible-build-reactjs-image.yml 
ansible-playbook ansible-build-web-image.yml
echo "the ansible build reactjs image finished"
ansible-playbook ansible-run-cluster.yml

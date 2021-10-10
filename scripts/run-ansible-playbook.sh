cd /home/abdelali/devops/ansible
echo "the ansible build nodejs image started"
ansible-playbook ansible-build-nodejs-image.yml 
echo "the ansible build nodejs image finished"
ansible-playbook ansible-build-reactjs-image.yml 
echo "the ansible build reactjs image finished"
ansible-playbook ansible-run-cluster.yml
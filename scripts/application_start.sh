# Go to app folder
cd /home/ubuntu/footyamigo
# stop delete and start again

pm2 stop footyamigo
pm2 delete footyamigo
pm2 start ecosystem.config.js --name "footyamigo" --env production
pm2 save
# forever stopall
# forever start /home/ubuntu/footyamigo/server.js
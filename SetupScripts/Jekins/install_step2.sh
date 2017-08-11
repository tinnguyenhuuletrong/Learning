#-----------------------------------------------------
# [Manual]
#	Setting
#		Replace gameloft by admin
#-----------------------------------------------------

# create an applications group
dseditgroup -o create -n . -u gameloft -p -r ‘Applications’ applications
# get the id for that group
sudo dscl . -read /Groups/applications
# find a unique identifier to give the user
sudo dscl . -list /Users UniqueID
# create the jenkins user
sudo dscl . -create /Users/jenkins
sudo dscl . -create /Users/jenkins PrimaryGroupID 505
sudo dscl . -create /Users/jenkins UniqueID 1026
sudo dscl . -create /Users/jenkins UserShell /bin/bash
sudo dscl . -create /Users/jenkins RealName "Jenkins"
sudo dscl . -create /Users/jenkins NFSHomeDirectory /Users/jenkins
sudo dscl . -passwd /Users/jenkins
# create and set the owner of the home directory
sudo mkdir /Users/jenkins
sudo chown -R jenkins /Users/jenkins


# create jekin config
echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd\">
<plist version=\"1.0\">
  <dict>
    <key>Label</key>
    <string>homebrew.mxcl.jenkins</string>
    <key>ProgramArguments</key>
    <array>
      <string>/usr/bin/java</string>
      <string>-Dmail.smtp.starttls.enable=true</string>
      <string>-jar</string>
      <string>/usr/local/opt/jenkins/libexec/jenkins.war</string>
      <string>--httpListenAddress=0.0.0.0</string>
      <string>--httpPort=8080</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>UserName</key>
    <string>jenkins</string>
  </dict>
</plist>" > /Library/LaunchDaemons/homebrew.mxcl.jenkins.plist
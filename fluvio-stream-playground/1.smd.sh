export PATH="${HOME}/.fvm/bin:${HOME}/.fluvio/bin:${PATH}"


fluvio topic create animal-names

# generate project
smdk generate

smdk build
smdk test --text "apple"
# cat

smdk test --text "durin"
# 

# Upload to cluster
smdk load

# list smart module
fluvio smartmodule list

#-----------------
# Play
#-----------------
fluvio topic create fruits

fluvio consume fruits --smartmodule=quickstart-sm
# Consuming records from 'fruits'
# apple
# a
# ab
# ake

# New tab
fluvio produce fruits
# > apple
# Ok!
# > a
# Ok!
# > de
# Ok!
# > bo
# Ok!
# > bi
# Ok!
# > ab
# Ok!
# > ake
# Ok!
# > keee
# Ok!
# > rew
# Ok!
# >
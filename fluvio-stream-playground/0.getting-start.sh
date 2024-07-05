export PATH="${HOME}/.fvm/bin:${HOME}/.fluvio/bin:${PATH}"
fluvio cluster start

fluvio topic create quickstart-topic
# topic "quickstart-topic" created

fluvio produce quickstart-topic
# > ok
# Ok!
# >
# Ok!
# > hello
# Ok!
# > are you there
# Ok!
# > is it ok
# Ok!
# > i am fine
# Ok!
# > ^C


fluvio consume quickstart-topic --beginning
# Consuming records from 'quickstart-topic' starting from the beginning of log
# ok
# ⠒                                                                                                                 
# hello
# are you there
# is it ok
# i am fine
# Consumer stream has closed


fluvio cluster delete
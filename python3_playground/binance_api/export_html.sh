BASEDIR=$(dirname $0)
echo "Script location: ${BASEDIR}"

pushd $BASEDIR
source ../mp_env/bin/activate
jupyter-nbconvert './notebook.ipynb' --execute --to html

popd
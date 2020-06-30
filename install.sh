echo "installing zeeguu-web-2.0 for development..."

if [[ -z "$ZEEGUU_API" ]]; then
    echo "Must provide ZEEGUU_API in environment" 1>&2
    exit 1
fi


cd javascript
echo "+++ installing required npm packages"
npm install
echo "+++ building the js packages"
npm run build


cd ../python 
echo "+++ creating virtual environment"
python3 -m venv venv

echo "+++ activating virtual environment"
source venv/bin/activate

echo "+++ installing required python packages"
pip install -r requirements.txt

cd ..

echo "+++ DONE."
echo "+++ Now you can call ./start_web.sh then visit the web app at http://localhost:9000"


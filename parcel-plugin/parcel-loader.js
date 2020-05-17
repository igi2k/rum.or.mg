const RawAsset = require('parcel-bundler/src/assets/RawAsset');

// fix for adding . in .htaccess
const original = RawAsset.prototype.generateBundleName;
RawAsset.prototype.generateBundleName = function (){
    const bundleName = original.call(this);
    if (bundleName.endsWith('.')) {
        return bundleName.substr(0, bundleName.length - 1);
    }
    return bundleName;
};

module.exports = (bundler) => {
    bundler.on('bundled', (mainBundle) => {
        mainBundle.type = 'html';
        mainBundle.name = 'index.html'
    });
}
// This function is from user speigg on Stack Overflow
// https://stackoverflow.com/a/22129960/5577482
// Because of this, the arrays in the data are referenced with . instead of []

// path needs to be a string
module.exports = function resolve(path, obj=self, separator='.') {
    var properties = Array.isArray(path) ? path : path.split(separator)
    return properties.reduce((prev, curr) => prev && prev[curr], obj)
};
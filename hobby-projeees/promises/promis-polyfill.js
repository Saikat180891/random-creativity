function CustomPromise(executor) {
    let resolveFn, rejectFn;

    this.then = function (onFulfilled, onRejected) {
        resolveFn = onFulfilled;
        rejectFn = onRejected;
        return this;
    }

    this.catch = function (onRejected) {
        rejectFn = onRejected;
        return this;
    }

    executor(
        function (value) {
            if (resolveFn) {
                resolveFn(value);
            }
        },
        function (reason) {
            if (rejectFn) {
                rejectFn(reason);
            }
        }
    );
}

// Example usage:
const myPromise = new CustomPromise((resolve, reject) => {
    setTimeout(() => {
        reject("Promise resolved!");
    }, 1000);
});


async function callPromise (){
    try {
        const result = await myPromise;
        console.log("await", result);
    } catch (error) {
        console.error("await catch", error);
    }
}

callPromise();

// myPromise.then((value) => {
//     console.log("then", value);
// }).catch((reason) => {
//     console.error("catch", reason);
// });
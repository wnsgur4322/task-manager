/** used to propogate an error up the call stack until it can be handled */
const assertError = (err: any) => {
    if (err instanceof Error) throw err;
}

export default assertError;
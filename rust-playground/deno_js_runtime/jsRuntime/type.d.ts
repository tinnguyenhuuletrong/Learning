interface runjs {
    say() : string
}

declare global {
    function setTimeout(ms:number): Promise<void>
    var runjs: runjs
}
export {};

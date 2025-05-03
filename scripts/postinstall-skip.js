if (process.env.SKIP) {
    console.warn('🚀  Skiping postinstall script');
    process.exit(0);
} else {
    process.exit(1);
}

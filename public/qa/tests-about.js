suite('"About" page test', function () {
    test('page should contain link to contact page', function () {
        assert($('a[href="/contact"]').length);
    })
})
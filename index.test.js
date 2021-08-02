const greet = require('./index');

test('Greet Tom', () => {
    expect(greet('Tom')).toBe('Hi');
});
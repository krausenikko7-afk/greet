def greet(name):
    """Return a friendly greeting for the given name."""
    if not name:
        return "Hello, stranger!"
    return f"Hello, {name}!"


if __name__ == "__main__":
    print(greet("World"))

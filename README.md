# greet

A tiny Python utility that returns a friendly greeting.

## Usage

```bash
python greet.py
```

This will pirnt:

```
Hello, World!
```

## API

`greet(name)` returns a greeting string. If `name` is empty, it greets a stranger.

## AI-маркетинговое агентство

Сайт с командой AI-агентов (копирайтер, SMM-менеджер, дизайнер, аналитик, стратег), которые отвечают через Claude API.

```bash
npm install
export ANTHROPIC_API_KEY=sk-ant-...
npm start
```

Открой http://localhost:3000. Без `ANTHROPIC_API_KEY` сайт открывается и показывает агентов, но чат вернёт понятную ошибку — добавь ключ переменной окружения и перезапусти сервер.

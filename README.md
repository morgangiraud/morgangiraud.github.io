# Personal website

Hi, welcome to the repository of my personal website. Nothing special to see here, it's barebone html file using tailwindcss for styles.

You can check the result here: [https://morgangiraud.com](https://morgangiraud.com)

## Installation

`yarn`

## Edit

Start tailwind `yarn watch`. Edit the HTML.

## Only render the CV

To render the CV in html just run: `yarn build:cv`
To get it as a pdf, just go print it from your favorite browser.

## Publish

1. Build the website: `yarn build`
2. Commit with a nice message: `git add . && git commit -S -m ""`
3. Push to main on Github! `git push`

## Notes:

- I'm using prettier to ensure a cool code style, check the `package.json` file for associated commands.

## Website banner

I made a banner to advertise something about my situation. Depending on the situation make sure to comment/uncomment the seciont in `<!-- Banner: start -->` & `<!-- Banner: end -->`

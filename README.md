### Uses puppeteer and yahoo-finance to calculate the grayscale ethereum (ETHE) discount

#### Usage
 1) ```zsh 
    // install puppeteer and yahoo-finance dependencies
    yarn
    ```
 2) ```zsh 
    // automated chromium browser will open ({headless: false} to bypass cloudflare)
    yarn start 
    ```
#### Example output
```zsh
┌──────────────────────────────────┬──────────────┐
│             (index)              │    Values    │
├──────────────────────────────────┼──────────────┤
│ Grayscale ETH Holdings Per Share │ '0.00997456' │
│          ETH-USD Price           │ '$ 3201.91'  │
│          ETHE-USD Price          │  '$ 24.48'   │
│     Grayscale ETHE Discount      │  '23.35 %'   │
└──────────────────────────────────┴──────────────┘
```
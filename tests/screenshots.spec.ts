import { test } from '@playwright/test';

const SCREENS = [
  { id: 'l1',             name: 'L1-Strategic'   },
  { id: 'l2-mhei',       name: 'L2-MHEI'        },
  { id: 'l2-fintech',    name: 'L2-Finance'      },
  { id: 'l2-clinical',   name: 'L2-Clinical'     },
  { id: 'l2-operational',name: 'L2-Operational'  },
  { id: 'l2-analytical', name: 'L2-Analytical'   },
];

test('screenshots', async ({ page }) => {
  for (const screen of SCREENS) {
    await page.goto(`/#${screen.id}`);
    await page.waitForTimeout(600);
    await page.screenshot({
      path: `tests/screenshots/${screen.name}.png`,
      fullPage: false,
    });
  }
});

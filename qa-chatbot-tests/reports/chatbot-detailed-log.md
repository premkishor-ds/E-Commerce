# CHATBOT QA RUN - DETAILED QUERY & RESPONSE AUDIT LOG

Total Cases: 1100
Passed: 40 | Partial: 36 | Failed: 1024

---

### [SEARCH_001] - Product Search
**User Query:** `I want to buy a Apple laptop`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 144 products** for "laptop":

• **Samsung Laptop - ORANGE (12)** — $485.00 ⭐4.9
• **Samsung Laptop - ORANGE (11)** — $190.00 ⭐4.8
• **Samsung Laptop - ORANGE (7)** — $95.00 ⭐4.7
• **Samsung Laptop - ORANGE (6)** — $50000.00 ⭐4.6

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_002] - Product Search
**User Query:** `Show me some Samsung phones`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_003] - Product Search
**User Query:** `Find a cheap headphones made by Sony`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 0 products** for "headphones" under $NaN:



Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_004] - Product Search
**User Query:** `Looking for a Dell keyboard`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `FALLBACK` | **Result Status:** `PARTIAL` | **Confidence:** `30%`

**Actual Response:**
```
🤔 I'm not sure I understood that.

Type **"help"** to see everything I can do, or try:
• "Search [product name]"
• "My orders"
• "Create support ticket"
```

**Evaluation Diagnosis:**
> Partial match: Intent mismatch (Expected: [SEARCH_PRODUCT], Got: [FALLBACK]) but actions matched.

---

### [SEARCH_005] - Product Search
**User Query:** `Search for HP mouse on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_006] - Product Search
**User Query:** `I want to buy a Lenovo monitor`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_007] - Product Search
**User Query:** `Show me some Asus cameras`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_008] - Product Search
**User Query:** `Find a cheap smartwatch made by Logitech`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_009] - Product Search
**User Query:** `Looking for a Bose speaker`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_010] - Product Search
**User Query:** `Search for LG tablet on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_011] - Product Search
**User Query:** `I want to buy a Intel charger`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_012] - Product Search
**User Query:** `Show me some AMD cables`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_013] - Product Search
**User Query:** `Find a cheap backpack made by Nvidia`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_014] - Product Search
**User Query:** `Looking for a Xiaomi desk lamp`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_015] - Product Search
**User Query:** `Search for OnePlus router on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_016] - Product Search
**User Query:** `I want to buy a Microsoft microphone`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 **Found 144 products** for "phone":

• **Samsung Phone - ORANGE (12)** — $180.00 ⭐4.5
• **Samsung Phone - ORANGE (11)** — $85.00 ⭐4.4
• **Samsung Phone - ORANGE (7)** — $49800.00 ⭐4.3
• **Samsung Phone - ORANGE (6)** — $19900.00 ⭐4.2

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_017] - Product Search
**User Query:** `Show me some Apple projectors`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_018] - Product Search
**User Query:** `Find a cheap earbuds made by Samsung`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_019] - Product Search
**User Query:** `Looking for a Sony hard drive`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_020] - Product Search
**User Query:** `Search for Dell graphics card on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_021] - Product Search
**User Query:** `I want to buy a HP laptop`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 144 products** for "laptop":

• **Samsung Laptop - ORANGE (12)** — $485.00 ⭐4.9
• **Samsung Laptop - ORANGE (11)** — $190.00 ⭐4.8
• **Samsung Laptop - ORANGE (7)** — $95.00 ⭐4.7
• **Samsung Laptop - ORANGE (6)** — $50000.00 ⭐4.6

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_022] - Product Search
**User Query:** `Show me some Lenovo phones`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 144 products** for "phone":

• **Samsung Phone - ORANGE (12)** — $180.00 ⭐4.5
• **Samsung Phone - ORANGE (11)** — $85.00 ⭐4.4
• **Samsung Phone - ORANGE (7)** — $49800.00 ⭐4.3
• **Samsung Phone - ORANGE (6)** — $19900.00 ⭐4.2

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_023] - Product Search
**User Query:** `Find a cheap headphones made by Asus`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 0 products** for "headphones" under $NaN:



Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_024] - Product Search
**User Query:** `Looking for a Logitech keyboard`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `FALLBACK` | **Result Status:** `PARTIAL` | **Confidence:** `30%`

**Actual Response:**
```
🤔 I'm not sure I understood that.

Type **"help"** to see everything I can do, or try:
• "Search [product name]"
• "My orders"
• "Create support ticket"
```

**Evaluation Diagnosis:**
> Partial match: Intent mismatch (Expected: [SEARCH_PRODUCT], Got: [FALLBACK]) but actions matched.

---

### [SEARCH_025] - Product Search
**User Query:** `Search for Bose mouse on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 144 products** for "mouse":

• **Samsung Mouse - ORANGE (12)** — $990.00 ⭐4.3
• **Samsung Mouse - ORANGE (11)** — $495.00 ⭐4.2
• **Samsung Mouse - ORANGE (7)** — $200.00 ⭐4.1
• **Samsung Mouse - ORANGE (6)** — $80.00 ⭐4

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_026] - Product Search
**User Query:** `I want to buy a LG monitor`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"monitor"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_027] - Product Search
**User Query:** `Show me some Intel cameras`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"camera"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_028] - Product Search
**User Query:** `Find a cheap smartwatch made by AMD`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_029] - Product Search
**User Query:** `Looking for a Nvidia speaker`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `FALLBACK` | **Result Status:** `PARTIAL` | **Confidence:** `30%`

**Actual Response:**
```
🤔 I'm not sure I understood that.

Type **"help"** to see everything I can do, or try:
• "Search [product name]"
• "My orders"
• "Create support ticket"
```

**Evaluation Diagnosis:**
> Partial match: Intent mismatch (Expected: [SEARCH_PRODUCT], Got: [FALLBACK]) but actions matched.

---

### [SEARCH_030] - Product Search
**User Query:** `Search for Xiaomi tablet on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"tablet"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_031] - Product Search
**User Query:** `I want to buy a OnePlus charger`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"OnePlus"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_032] - Product Search
**User Query:** `Show me some Microsoft cables`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"me some Microsoft cables"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_033] - Product Search
**User Query:** `Find a cheap backpack made by Apple`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"Apple"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_034] - Product Search
**User Query:** `Looking for a Samsung desk lamp`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_035] - Product Search
**User Query:** `Search for Sony router on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"Sony"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_036] - Product Search
**User Query:** `I want to buy a Dell microphone`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_037] - Product Search
**User Query:** `Show me some HP projectors`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"hp"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_038] - Product Search
**User Query:** `Find a cheap earbuds made by Lenovo`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 **Found 0 products** for "earbud" under $NaN:



Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_039] - Product Search
**User Query:** `Looking for a Asus hard drive`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"asus"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_040] - Product Search
**User Query:** `Search for Logitech graphics card on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_041] - Product Search
**User Query:** `I want to buy a Bose laptop`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 144 products** for "laptop":

• **Samsung Laptop - ORANGE (12)** — $485.00 ⭐4.9
• **Samsung Laptop - ORANGE (11)** — $190.00 ⭐4.8
• **Samsung Laptop - ORANGE (7)** — $95.00 ⭐4.7
• **Samsung Laptop - ORANGE (6)** — $50000.00 ⭐4.6

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_042] - Product Search
**User Query:** `Show me some LG phones`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 144 products** for "phone":

• **Samsung Phone - ORANGE (12)** — $180.00 ⭐4.5
• **Samsung Phone - ORANGE (11)** — $85.00 ⭐4.4
• **Samsung Phone - ORANGE (7)** — $49800.00 ⭐4.3
• **Samsung Phone - ORANGE (6)** — $19900.00 ⭐4.2

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_043] - Product Search
**User Query:** `Find a cheap headphones made by Intel`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 0 products** for "headphones" under $NaN:



Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_044] - Product Search
**User Query:** `Looking for a AMD keyboard`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `FALLBACK` | **Result Status:** `PARTIAL` | **Confidence:** `30%`

**Actual Response:**
```
🤔 I'm not sure I understood that.

Type **"help"** to see everything I can do, or try:
• "Search [product name]"
• "My orders"
• "Create support ticket"
```

**Evaluation Diagnosis:**
> Partial match: Intent mismatch (Expected: [SEARCH_PRODUCT], Got: [FALLBACK]) but actions matched.

---

### [SEARCH_045] - Product Search
**User Query:** `Search for Nvidia mouse on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 144 products** for "mouse":

• **Samsung Mouse - ORANGE (12)** — $990.00 ⭐4.3
• **Samsung Mouse - ORANGE (11)** — $495.00 ⭐4.2
• **Samsung Mouse - ORANGE (7)** — $200.00 ⭐4.1
• **Samsung Mouse - ORANGE (6)** — $80.00 ⭐4

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_046] - Product Search
**User Query:** `I want to buy a Xiaomi monitor`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_047] - Product Search
**User Query:** `Show me some OnePlus cameras`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"camera"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_048] - Product Search
**User Query:** `Find a cheap smartwatch made by Microsoft`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 **Found 0 products** for "watch" under $NaN:



Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_049] - Product Search
**User Query:** `Looking for a Apple speaker`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `FALLBACK` | **Result Status:** `PARTIAL` | **Confidence:** `30%`

**Actual Response:**
```
🤔 I'm not sure I understood that.

Type **"help"** to see everything I can do, or try:
• "Search [product name]"
• "My orders"
• "Create support ticket"
```

**Evaluation Diagnosis:**
> Partial match: Intent mismatch (Expected: [SEARCH_PRODUCT], Got: [FALLBACK]) but actions matched.

---

### [SEARCH_050] - Product Search
**User Query:** `Search for Samsung tablet on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"tablet"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_051] - Product Search
**User Query:** `I want to buy a Sony charger`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_052] - Product Search
**User Query:** `Show me some Dell cables`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"dell"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_053] - Product Search
**User Query:** `Find a cheap backpack made by HP`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"hp"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_054] - Product Search
**User Query:** `Looking for a Lenovo desk lamp`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"lenovo"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_055] - Product Search
**User Query:** `Search for Asus router on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"asus"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_056] - Product Search
**User Query:** `I want to buy a Logitech microphone`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 **Found 144 products** for "phone":

• **Samsung Phone - ORANGE (12)** — $180.00 ⭐4.5
• **Samsung Phone - ORANGE (11)** — $85.00 ⭐4.4
• **Samsung Phone - ORANGE (7)** — $49800.00 ⭐4.3
• **Samsung Phone - ORANGE (6)** — $19900.00 ⭐4.2

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_057] - Product Search
**User Query:** `Show me some Bose projectors`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"me some Bose projectors"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_058] - Product Search
**User Query:** `Find a cheap earbuds made by LG`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 **Found 0 products** for "earbud" under $NaN:



Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_059] - Product Search
**User Query:** `Looking for a Intel hard drive`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"a Intel hard drive"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_060] - Product Search
**User Query:** `Search for AMD graphics card on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"for AMD graphics card on your store"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_061] - Product Search
**User Query:** `I want to buy a Nvidia laptop`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 144 products** for "laptop":

• **Samsung Laptop - ORANGE (12)** — $485.00 ⭐4.9
• **Samsung Laptop - ORANGE (11)** — $190.00 ⭐4.8
• **Samsung Laptop - ORANGE (7)** — $95.00 ⭐4.7
• **Samsung Laptop - ORANGE (6)** — $50000.00 ⭐4.6

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_062] - Product Search
**User Query:** `Show me some Xiaomi phones`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 144 products** for "phone":

• **Samsung Phone - ORANGE (12)** — $180.00 ⭐4.5
• **Samsung Phone - ORANGE (11)** — $85.00 ⭐4.4
• **Samsung Phone - ORANGE (7)** — $49800.00 ⭐4.3
• **Samsung Phone - ORANGE (6)** — $19900.00 ⭐4.2

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_063] - Product Search
**User Query:** `Find a cheap headphones made by OnePlus`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 0 products** for "headphones" under $NaN:



Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_064] - Product Search
**User Query:** `Looking for a Microsoft keyboard`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `FALLBACK` | **Result Status:** `PARTIAL` | **Confidence:** `30%`

**Actual Response:**
```
🤔 I'm not sure I understood that.

Type **"help"** to see everything I can do, or try:
• "Search [product name]"
• "My orders"
• "Create support ticket"
```

**Evaluation Diagnosis:**
> Partial match: Intent mismatch (Expected: [SEARCH_PRODUCT], Got: [FALLBACK]) but actions matched.

---

### [SEARCH_065] - Product Search
**User Query:** `Search for Apple mouse on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 144 products** for "mouse":

• **Samsung Mouse - ORANGE (12)** — $990.00 ⭐4.3
• **Samsung Mouse - ORANGE (11)** — $495.00 ⭐4.2
• **Samsung Mouse - ORANGE (7)** — $200.00 ⭐4.1
• **Samsung Mouse - ORANGE (6)** — $80.00 ⭐4

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_066] - Product Search
**User Query:** `I want to buy a Samsung monitor`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"monitor"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_067] - Product Search
**User Query:** `Show me some Sony cameras`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"camera"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_068] - Product Search
**User Query:** `Find a cheap smartwatch made by Dell`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 **Found 0 products** for "watch" under $NaN:



Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_069] - Product Search
**User Query:** `Looking for a HP speaker`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `FALLBACK` | **Result Status:** `PARTIAL` | **Confidence:** `30%`

**Actual Response:**
```
🤔 I'm not sure I understood that.

Type **"help"** to see everything I can do, or try:
• "Search [product name]"
• "My orders"
• "Create support ticket"
```

**Evaluation Diagnosis:**
> Partial match: Intent mismatch (Expected: [SEARCH_PRODUCT], Got: [FALLBACK]) but actions matched.

---

### [SEARCH_070] - Product Search
**User Query:** `Search for Lenovo tablet on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"tablet"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_071] - Product Search
**User Query:** `I want to buy a Asus charger`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"asus"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_072] - Product Search
**User Query:** `Show me some Logitech cables`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"me some Logitech cables"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_073] - Product Search
**User Query:** `Find a cheap backpack made by Bose`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"a cheap backpack made by Bose"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_074] - Product Search
**User Query:** `Looking for a LG desk lamp`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"lg"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_075] - Product Search
**User Query:** `Search for Intel router on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"for Intel router on your store"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_076] - Product Search
**User Query:** `I want to buy a AMD microphone`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 **Found 144 products** for "phone":

• **Samsung Phone - ORANGE (12)** — $180.00 ⭐4.5
• **Samsung Phone - ORANGE (11)** — $85.00 ⭐4.4
• **Samsung Phone - ORANGE (7)** — $49800.00 ⭐4.3
• **Samsung Phone - ORANGE (6)** — $19900.00 ⭐4.2

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_077] - Product Search
**User Query:** `Show me some Nvidia projectors`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"me some Nvidia projectors"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_078] - Product Search
**User Query:** `Find a cheap earbuds made by Xiaomi`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 **Found 0 products** for "earbud" under $NaN:



Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_079] - Product Search
**User Query:** `Looking for a OnePlus hard drive`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"OnePlus"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_080] - Product Search
**User Query:** `Search for Microsoft graphics card on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"for Microsoft graphics card on your store"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_081] - Product Search
**User Query:** `I want to buy a Apple laptop`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 144 products** for "laptop":

• **Samsung Laptop - ORANGE (12)** — $485.00 ⭐4.9
• **Samsung Laptop - ORANGE (11)** — $190.00 ⭐4.8
• **Samsung Laptop - ORANGE (7)** — $95.00 ⭐4.7
• **Samsung Laptop - ORANGE (6)** — $50000.00 ⭐4.6

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_082] - Product Search
**User Query:** `Show me some Samsung phones`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 144 products** for "phone":

• **Samsung Phone - ORANGE (12)** — $180.00 ⭐4.5
• **Samsung Phone - ORANGE (11)** — $85.00 ⭐4.4
• **Samsung Phone - ORANGE (7)** — $49800.00 ⭐4.3
• **Samsung Phone - ORANGE (6)** — $19900.00 ⭐4.2

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_083] - Product Search
**User Query:** `Find a cheap headphones made by Sony`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 0 products** for "headphones" under $NaN:



Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_084] - Product Search
**User Query:** `Looking for a Dell keyboard`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `FALLBACK` | **Result Status:** `PARTIAL` | **Confidence:** `30%`

**Actual Response:**
```
🤔 I'm not sure I understood that.

Type **"help"** to see everything I can do, or try:
• "Search [product name]"
• "My orders"
• "Create support ticket"
```

**Evaluation Diagnosis:**
> Partial match: Intent mismatch (Expected: [SEARCH_PRODUCT], Got: [FALLBACK]) but actions matched.

---

### [SEARCH_085] - Product Search
**User Query:** `Search for HP mouse on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `8%`

**Actual Response:**
```
🔍 **Found 144 products** for "mouse":

• **Samsung Mouse - ORANGE (12)** — $990.00 ⭐4.3
• **Samsung Mouse - ORANGE (11)** — $495.00 ⭐4.2
• **Samsung Mouse - ORANGE (7)** — $200.00 ⭐4.1
• **Samsung Mouse - ORANGE (6)** — $80.00 ⭐4

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_086] - Product Search
**User Query:** `I want to buy a Lenovo monitor`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"monitor"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_087] - Product Search
**User Query:** `Show me some Asus cameras`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"camera"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_088] - Product Search
**User Query:** `Find a cheap smartwatch made by Logitech`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 **Found 0 products** for "watch" under $NaN:



Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_089] - Product Search
**User Query:** `Looking for a Bose speaker`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_090] - Product Search
**User Query:** `Search for LG tablet on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"tablet"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_091] - Product Search
**User Query:** `I want to buy a Intel charger`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: timeout of 5000ms exceeded
```

**Evaluation Diagnosis:**
> Network or Server error: timeout of 5000ms exceeded

---

### [SEARCH_092] - Product Search
**User Query:** `Show me some AMD cables`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"me some AMD cables"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_093] - Product Search
**User Query:** `Find a cheap backpack made by Nvidia`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PASS` | **Confidence:** `7%`

**Actual Response:**
```
🔍 No products found for **"a cheap backpack made by Nvidia"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> The chatbot understood the user intent and responded appropriately.

---

### [SEARCH_094] - Product Search
**User Query:** `Looking for a Xiaomi desk lamp`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"xiaomi"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_095] - Product Search
**User Query:** `Search for OnePlus router on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"OnePlus"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_096] - Product Search
**User Query:** `I want to buy a Microsoft microphone`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 **Found 144 products** for "phone":

• **Samsung Phone - ORANGE (12)** — $180.00 ⭐4.5
• **Samsung Phone - ORANGE (11)** — $85.00 ⭐4.4
• **Samsung Phone - ORANGE (7)** — $49800.00 ⭐4.3
• **Samsung Phone - ORANGE (6)** — $19900.00 ⭐4.2

Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_097] - Product Search
**User Query:** `Show me some Apple projectors`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"Apple"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_098] - Product Search
**User Query:** `Find a cheap earbuds made by Samsung`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 **Found 0 products** for "earbud" under $NaN:



Type the **product name** to see details, or **"add [name] to cart"** to purchase!
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_099] - Product Search
**User Query:** `Looking for a Sony hard drive`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"Sony"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [SEARCH_100] - Product Search
**User Query:** `Search for Dell graphics card on your store`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `SEARCH_PRODUCT` | **Result Status:** `PARTIAL` | **Confidence:** `50%`

**Actual Response:**
```
🔍 No products found for **"dell"**.

Try searching for:
• Electronics, Fashion, Kitchen, Fitness
• Specific brands like ApexTech, NexaHome
• Or browse all products on the [Search page](/search)
```

**Evaluation Diagnosis:**
> Intent and action matched, but the response relevance check failed (e.g. key terms missing or fallback detected).

---

### [DETAILS_001] - Product Details
**User Query:** `What are the specs of the Apple laptop?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_002] - Product Details
**User Query:** `Show details for Samsung phone`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_003] - Product Details
**User Query:** `Tell me about Sony headphones`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_004] - Product Details
**User Query:** `What features does the Dell keyboard have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_005] - Product Details
**User Query:** `Give me specifications of HP mouse`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_006] - Product Details
**User Query:** `What are the specs of the Lenovo monitor?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_007] - Product Details
**User Query:** `Show details for Asus camera`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_008] - Product Details
**User Query:** `Tell me about Logitech smartwatch`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_009] - Product Details
**User Query:** `What features does the Bose speaker have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_010] - Product Details
**User Query:** `Give me specifications of LG tablet`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_011] - Product Details
**User Query:** `What are the specs of the Intel charger?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_012] - Product Details
**User Query:** `Show details for AMD cable`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_013] - Product Details
**User Query:** `Tell me about Nvidia backpack`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_014] - Product Details
**User Query:** `What features does the Xiaomi desk lamp have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_015] - Product Details
**User Query:** `Give me specifications of OnePlus router`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_016] - Product Details
**User Query:** `What are the specs of the Microsoft microphone?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_017] - Product Details
**User Query:** `Show details for Apple projector`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_018] - Product Details
**User Query:** `Tell me about Samsung earbuds`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_019] - Product Details
**User Query:** `What features does the Sony hard drive have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_020] - Product Details
**User Query:** `Give me specifications of Dell graphics card`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_021] - Product Details
**User Query:** `What are the specs of the HP laptop?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_022] - Product Details
**User Query:** `Show details for Lenovo phone`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_023] - Product Details
**User Query:** `Tell me about Asus headphones`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_024] - Product Details
**User Query:** `What features does the Logitech keyboard have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_025] - Product Details
**User Query:** `Give me specifications of Bose mouse`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_026] - Product Details
**User Query:** `What are the specs of the LG monitor?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_027] - Product Details
**User Query:** `Show details for Intel camera`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_028] - Product Details
**User Query:** `Tell me about AMD smartwatch`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_029] - Product Details
**User Query:** `What features does the Nvidia speaker have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_030] - Product Details
**User Query:** `Give me specifications of Xiaomi tablet`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_031] - Product Details
**User Query:** `What are the specs of the OnePlus charger?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_032] - Product Details
**User Query:** `Show details for Microsoft cable`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_033] - Product Details
**User Query:** `Tell me about Apple backpack`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_034] - Product Details
**User Query:** `What features does the Samsung desk lamp have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_035] - Product Details
**User Query:** `Give me specifications of Sony router`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_036] - Product Details
**User Query:** `What are the specs of the Dell microphone?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_037] - Product Details
**User Query:** `Show details for HP projector`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_038] - Product Details
**User Query:** `Tell me about Lenovo earbuds`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_039] - Product Details
**User Query:** `What features does the Asus hard drive have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_040] - Product Details
**User Query:** `Give me specifications of Logitech graphics card`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_041] - Product Details
**User Query:** `What are the specs of the Bose laptop?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_042] - Product Details
**User Query:** `Show details for LG phone`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_043] - Product Details
**User Query:** `Tell me about Intel headphones`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_044] - Product Details
**User Query:** `What features does the AMD keyboard have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_045] - Product Details
**User Query:** `Give me specifications of Nvidia mouse`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_046] - Product Details
**User Query:** `What are the specs of the Xiaomi monitor?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_047] - Product Details
**User Query:** `Show details for OnePlus camera`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_048] - Product Details
**User Query:** `Tell me about Microsoft smartwatch`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_049] - Product Details
**User Query:** `What features does the Apple speaker have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_050] - Product Details
**User Query:** `Give me specifications of Samsung tablet`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_051] - Product Details
**User Query:** `What are the specs of the Sony charger?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_052] - Product Details
**User Query:** `Show details for Dell cable`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_053] - Product Details
**User Query:** `Tell me about HP backpack`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_054] - Product Details
**User Query:** `What features does the Lenovo desk lamp have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_055] - Product Details
**User Query:** `Give me specifications of Asus router`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_056] - Product Details
**User Query:** `What are the specs of the Logitech microphone?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_057] - Product Details
**User Query:** `Show details for Bose projector`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_058] - Product Details
**User Query:** `Tell me about LG earbuds`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_059] - Product Details
**User Query:** `What features does the Intel hard drive have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_060] - Product Details
**User Query:** `Give me specifications of AMD graphics card`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_061] - Product Details
**User Query:** `What are the specs of the Nvidia laptop?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_062] - Product Details
**User Query:** `Show details for Xiaomi phone`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_063] - Product Details
**User Query:** `Tell me about OnePlus headphones`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_064] - Product Details
**User Query:** `What features does the Microsoft keyboard have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_065] - Product Details
**User Query:** `Give me specifications of Apple mouse`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_066] - Product Details
**User Query:** `What are the specs of the Samsung monitor?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_067] - Product Details
**User Query:** `Show details for Sony camera`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_068] - Product Details
**User Query:** `Tell me about Dell smartwatch`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_069] - Product Details
**User Query:** `What features does the HP speaker have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_070] - Product Details
**User Query:** `Give me specifications of Lenovo tablet`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_071] - Product Details
**User Query:** `What are the specs of the Asus charger?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_072] - Product Details
**User Query:** `Show details for Logitech cable`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_073] - Product Details
**User Query:** `Tell me about Bose backpack`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_074] - Product Details
**User Query:** `What features does the LG desk lamp have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_075] - Product Details
**User Query:** `Give me specifications of Intel router`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_076] - Product Details
**User Query:** `What are the specs of the AMD microphone?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_077] - Product Details
**User Query:** `Show details for Nvidia projector`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_078] - Product Details
**User Query:** `Tell me about Xiaomi earbuds`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_079] - Product Details
**User Query:** `What features does the OnePlus hard drive have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_080] - Product Details
**User Query:** `Give me specifications of Microsoft graphics card`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_081] - Product Details
**User Query:** `What are the specs of the Apple laptop?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_082] - Product Details
**User Query:** `Show details for Samsung phone`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_083] - Product Details
**User Query:** `Tell me about Sony headphones`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_084] - Product Details
**User Query:** `What features does the Dell keyboard have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_085] - Product Details
**User Query:** `Give me specifications of HP mouse`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_086] - Product Details
**User Query:** `What are the specs of the Lenovo monitor?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_087] - Product Details
**User Query:** `Show details for Asus camera`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_088] - Product Details
**User Query:** `Tell me about Logitech smartwatch`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_089] - Product Details
**User Query:** `What features does the Bose speaker have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_090] - Product Details
**User Query:** `Give me specifications of LG tablet`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_091] - Product Details
**User Query:** `What are the specs of the Intel charger?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_092] - Product Details
**User Query:** `Show details for AMD cable`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_093] - Product Details
**User Query:** `Tell me about Nvidia backpack`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_094] - Product Details
**User Query:** `What features does the Xiaomi desk lamp have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_095] - Product Details
**User Query:** `Give me specifications of OnePlus router`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_096] - Product Details
**User Query:** `What are the specs of the Microsoft microphone?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_097] - Product Details
**User Query:** `Show details for Apple projector`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_098] - Product Details
**User Query:** `Tell me about Samsung earbuds`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_099] - Product Details
**User Query:** `What features does the Sony hard drive have?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [DETAILS_100] - Product Details
**User Query:** `Give me specifications of Dell graphics card`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_001] - Comparison
**User Query:** `Compare Apple laptop vs Samsung laptop`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_002] - Comparison
**User Query:** `Which is better: Samsung phone or Sony phone?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_003] - Comparison
**User Query:** `Show me the difference between Sony and Dell headphones`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_004] - Comparison
**User Query:** `Comparison of Dell keyboard versus HP keyboard`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_005] - Comparison
**User Query:** `Should I buy HP mouse or Lenovo mouse?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_006] - Comparison
**User Query:** `Compare Lenovo monitor vs Asus monitor`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_007] - Comparison
**User Query:** `Which is better: Asus camera or Logitech camera?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_008] - Comparison
**User Query:** `Show me the difference between Logitech and Bose smartwatch`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_009] - Comparison
**User Query:** `Comparison of Bose speaker versus LG speaker`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_010] - Comparison
**User Query:** `Should I buy LG tablet or Intel tablet?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_011] - Comparison
**User Query:** `Compare Intel charger vs AMD charger`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_012] - Comparison
**User Query:** `Which is better: AMD cable or Nvidia cable?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_013] - Comparison
**User Query:** `Show me the difference between Nvidia and Xiaomi backpack`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_014] - Comparison
**User Query:** `Comparison of Xiaomi desk lamp versus OnePlus desk lamp`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_015] - Comparison
**User Query:** `Should I buy OnePlus router or Microsoft router?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_016] - Comparison
**User Query:** `Compare Microsoft microphone vs Apple microphone`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_017] - Comparison
**User Query:** `Which is better: Apple projector or Samsung projector?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_018] - Comparison
**User Query:** `Show me the difference between Samsung and Sony earbuds`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_019] - Comparison
**User Query:** `Comparison of Sony hard drive versus Dell hard drive`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_020] - Comparison
**User Query:** `Should I buy Dell graphics card or HP graphics card?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_021] - Comparison
**User Query:** `Compare HP laptop vs Lenovo laptop`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_022] - Comparison
**User Query:** `Which is better: Lenovo phone or Asus phone?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_023] - Comparison
**User Query:** `Show me the difference between Asus and Logitech headphones`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_024] - Comparison
**User Query:** `Comparison of Logitech keyboard versus Bose keyboard`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_025] - Comparison
**User Query:** `Should I buy Bose mouse or LG mouse?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_026] - Comparison
**User Query:** `Compare LG monitor vs Intel monitor`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_027] - Comparison
**User Query:** `Which is better: Intel camera or AMD camera?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_028] - Comparison
**User Query:** `Show me the difference between AMD and Nvidia smartwatch`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_029] - Comparison
**User Query:** `Comparison of Nvidia speaker versus Xiaomi speaker`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_030] - Comparison
**User Query:** `Should I buy Xiaomi tablet or OnePlus tablet?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_031] - Comparison
**User Query:** `Compare OnePlus charger vs Microsoft charger`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_032] - Comparison
**User Query:** `Which is better: Microsoft cable or Apple cable?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_033] - Comparison
**User Query:** `Show me the difference between Apple and Samsung backpack`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_034] - Comparison
**User Query:** `Comparison of Samsung desk lamp versus Sony desk lamp`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_035] - Comparison
**User Query:** `Should I buy Sony router or Dell router?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_036] - Comparison
**User Query:** `Compare Dell microphone vs HP microphone`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_037] - Comparison
**User Query:** `Which is better: HP projector or Lenovo projector?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_038] - Comparison
**User Query:** `Show me the difference between Lenovo and Asus earbuds`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_039] - Comparison
**User Query:** `Comparison of Asus hard drive versus Logitech hard drive`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_040] - Comparison
**User Query:** `Should I buy Logitech graphics card or Bose graphics card?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_041] - Comparison
**User Query:** `Compare Bose laptop vs LG laptop`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_042] - Comparison
**User Query:** `Which is better: LG phone or Intel phone?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_043] - Comparison
**User Query:** `Show me the difference between Intel and AMD headphones`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_044] - Comparison
**User Query:** `Comparison of AMD keyboard versus Nvidia keyboard`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_045] - Comparison
**User Query:** `Should I buy Nvidia mouse or Xiaomi mouse?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_046] - Comparison
**User Query:** `Compare Xiaomi monitor vs OnePlus monitor`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_047] - Comparison
**User Query:** `Which is better: OnePlus camera or Microsoft camera?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_048] - Comparison
**User Query:** `Show me the difference between Microsoft and Apple smartwatch`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_049] - Comparison
**User Query:** `Comparison of Apple speaker versus Samsung speaker`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_050] - Comparison
**User Query:** `Should I buy Samsung tablet or Sony tablet?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_051] - Comparison
**User Query:** `Compare Sony charger vs Dell charger`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_052] - Comparison
**User Query:** `Which is better: Dell cable or HP cable?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_053] - Comparison
**User Query:** `Show me the difference between HP and Lenovo backpack`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_054] - Comparison
**User Query:** `Comparison of Lenovo desk lamp versus Asus desk lamp`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_055] - Comparison
**User Query:** `Should I buy Asus router or Logitech router?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_056] - Comparison
**User Query:** `Compare Logitech microphone vs Bose microphone`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_057] - Comparison
**User Query:** `Which is better: Bose projector or LG projector?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_058] - Comparison
**User Query:** `Show me the difference between LG and Intel earbuds`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_059] - Comparison
**User Query:** `Comparison of Intel hard drive versus AMD hard drive`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_060] - Comparison
**User Query:** `Should I buy AMD graphics card or Nvidia graphics card?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_061] - Comparison
**User Query:** `Compare Nvidia laptop vs Xiaomi laptop`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_062] - Comparison
**User Query:** `Which is better: Xiaomi phone or OnePlus phone?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_063] - Comparison
**User Query:** `Show me the difference between OnePlus and Microsoft headphones`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_064] - Comparison
**User Query:** `Comparison of Microsoft keyboard versus Apple keyboard`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_065] - Comparison
**User Query:** `Should I buy Apple mouse or Samsung mouse?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_066] - Comparison
**User Query:** `Compare Samsung monitor vs Sony monitor`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_067] - Comparison
**User Query:** `Which is better: Sony camera or Dell camera?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_068] - Comparison
**User Query:** `Show me the difference between Dell and HP smartwatch`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_069] - Comparison
**User Query:** `Comparison of HP speaker versus Lenovo speaker`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_070] - Comparison
**User Query:** `Should I buy Lenovo tablet or Asus tablet?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_071] - Comparison
**User Query:** `Compare Asus charger vs Logitech charger`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_072] - Comparison
**User Query:** `Which is better: Logitech cable or Bose cable?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_073] - Comparison
**User Query:** `Show me the difference between Bose and LG backpack`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_074] - Comparison
**User Query:** `Comparison of LG desk lamp versus Intel desk lamp`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_075] - Comparison
**User Query:** `Should I buy Intel router or AMD router?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_076] - Comparison
**User Query:** `Compare AMD microphone vs Nvidia microphone`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_077] - Comparison
**User Query:** `Which is better: Nvidia projector or Xiaomi projector?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_078] - Comparison
**User Query:** `Show me the difference between Xiaomi and OnePlus earbuds`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_079] - Comparison
**User Query:** `Comparison of OnePlus hard drive versus Microsoft hard drive`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_080] - Comparison
**User Query:** `Should I buy Microsoft graphics card or Apple graphics card?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_081] - Comparison
**User Query:** `Compare Apple laptop vs Samsung laptop`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_082] - Comparison
**User Query:** `Which is better: Samsung phone or Sony phone?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_083] - Comparison
**User Query:** `Show me the difference between Sony and Dell headphones`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_084] - Comparison
**User Query:** `Comparison of Dell keyboard versus HP keyboard`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_085] - Comparison
**User Query:** `Should I buy HP mouse or Lenovo mouse?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_086] - Comparison
**User Query:** `Compare Lenovo monitor vs Asus monitor`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_087] - Comparison
**User Query:** `Which is better: Asus camera or Logitech camera?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_088] - Comparison
**User Query:** `Show me the difference between Logitech and Bose smartwatch`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_089] - Comparison
**User Query:** `Comparison of Bose speaker versus LG speaker`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_090] - Comparison
**User Query:** `Should I buy LG tablet or Intel tablet?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_091] - Comparison
**User Query:** `Compare Intel charger vs AMD charger`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_092] - Comparison
**User Query:** `Which is better: AMD cable or Nvidia cable?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_093] - Comparison
**User Query:** `Show me the difference between Nvidia and Xiaomi backpack`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_094] - Comparison
**User Query:** `Comparison of Xiaomi desk lamp versus OnePlus desk lamp`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_095] - Comparison
**User Query:** `Should I buy OnePlus router or Microsoft router?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_096] - Comparison
**User Query:** `Compare Microsoft microphone vs Apple microphone`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_097] - Comparison
**User Query:** `Which is better: Apple projector or Samsung projector?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_098] - Comparison
**User Query:** `Show me the difference between Samsung and Sony earbuds`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_099] - Comparison
**User Query:** `Comparison of Sony hard drive versus Dell hard drive`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [COMPARE_100] - Comparison
**User Query:** `Should I buy Dell graphics card or HP graphics card?`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_001] - Cart
**User Query:** `Add Apple laptop to my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_002] - Cart
**User Query:** `Put the Samsung phone in cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_003] - Cart
**User Query:** `Remove Sony headphones from cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_004] - Cart
**User Query:** `Update quantity of Dell keyboard to 4`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_005] - Cart
**User Query:** `Change qty of mouse to 5`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_006] - Cart
**User Query:** `Show my cart items`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_007] - Cart
**User Query:** `View my shopping cart`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_008] - Cart
**User Query:** `Clear my entire cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_009] - Cart
**User Query:** `Empty the cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_010] - Cart
**User Query:** `Add LG tablet to my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_011] - Cart
**User Query:** `Put the Intel charger in cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_012] - Cart
**User Query:** `Remove AMD cable from cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_013] - Cart
**User Query:** `Update quantity of Nvidia backpack to 3`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_014] - Cart
**User Query:** `Change qty of desk lamp to 4`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_015] - Cart
**User Query:** `Show my cart items`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_016] - Cart
**User Query:** `View my shopping cart`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_017] - Cart
**User Query:** `Clear my entire cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_018] - Cart
**User Query:** `Empty the cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_019] - Cart
**User Query:** `Add Sony hard drive to my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_020] - Cart
**User Query:** `Put the Dell graphics card in cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_021] - Cart
**User Query:** `Remove HP laptop from cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_022] - Cart
**User Query:** `Update quantity of Lenovo phone to 2`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_023] - Cart
**User Query:** `Change qty of headphones to 3`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_024] - Cart
**User Query:** `Show my cart items`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_025] - Cart
**User Query:** `View my shopping cart`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_026] - Cart
**User Query:** `Clear my entire cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_027] - Cart
**User Query:** `Empty the cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_028] - Cart
**User Query:** `Add AMD smartwatch to my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_029] - Cart
**User Query:** `Put the Nvidia speaker in cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_030] - Cart
**User Query:** `Remove Xiaomi tablet from cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_031] - Cart
**User Query:** `Update quantity of OnePlus charger to 1`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_032] - Cart
**User Query:** `Change qty of cable to 2`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_033] - Cart
**User Query:** `Show my cart items`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_034] - Cart
**User Query:** `View my shopping cart`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_035] - Cart
**User Query:** `Clear my entire cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_036] - Cart
**User Query:** `Empty the cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_037] - Cart
**User Query:** `Add HP projector to my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_038] - Cart
**User Query:** `Put the Lenovo earbuds in cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_039] - Cart
**User Query:** `Remove Asus hard drive from cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_040] - Cart
**User Query:** `Update quantity of Logitech graphics card to 5`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_041] - Cart
**User Query:** `Change qty of laptop to 1`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_042] - Cart
**User Query:** `Show my cart items`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_043] - Cart
**User Query:** `View my shopping cart`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_044] - Cart
**User Query:** `Clear my entire cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_045] - Cart
**User Query:** `Empty the cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_046] - Cart
**User Query:** `Add Xiaomi monitor to my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_047] - Cart
**User Query:** `Put the OnePlus camera in cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_048] - Cart
**User Query:** `Remove Microsoft smartwatch from cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_049] - Cart
**User Query:** `Update quantity of Apple speaker to 4`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_050] - Cart
**User Query:** `Change qty of tablet to 5`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_051] - Cart
**User Query:** `Show my cart items`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_052] - Cart
**User Query:** `View my shopping cart`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_053] - Cart
**User Query:** `Clear my entire cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_054] - Cart
**User Query:** `Empty the cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_055] - Cart
**User Query:** `Add Asus router to my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_056] - Cart
**User Query:** `Put the Logitech microphone in cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_057] - Cart
**User Query:** `Remove Bose projector from cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_058] - Cart
**User Query:** `Update quantity of LG earbuds to 3`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_059] - Cart
**User Query:** `Change qty of hard drive to 4`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_060] - Cart
**User Query:** `Show my cart items`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_061] - Cart
**User Query:** `View my shopping cart`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_062] - Cart
**User Query:** `Clear my entire cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_063] - Cart
**User Query:** `Empty the cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_064] - Cart
**User Query:** `Add Microsoft keyboard to my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_065] - Cart
**User Query:** `Put the Apple mouse in cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_066] - Cart
**User Query:** `Remove Samsung monitor from cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_067] - Cart
**User Query:** `Update quantity of Sony camera to 2`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_068] - Cart
**User Query:** `Change qty of smartwatch to 3`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_069] - Cart
**User Query:** `Show my cart items`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_070] - Cart
**User Query:** `View my shopping cart`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_071] - Cart
**User Query:** `Clear my entire cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_072] - Cart
**User Query:** `Empty the cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_073] - Cart
**User Query:** `Add Bose backpack to my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_074] - Cart
**User Query:** `Put the LG desk lamp in cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_075] - Cart
**User Query:** `Remove Intel router from cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_076] - Cart
**User Query:** `Update quantity of AMD microphone to 1`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_077] - Cart
**User Query:** `Change qty of projector to 2`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_078] - Cart
**User Query:** `Show my cart items`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_079] - Cart
**User Query:** `View my shopping cart`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_080] - Cart
**User Query:** `Clear my entire cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_081] - Cart
**User Query:** `Empty the cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_082] - Cart
**User Query:** `Add Samsung phone to my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_083] - Cart
**User Query:** `Put the Sony headphones in cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_084] - Cart
**User Query:** `Remove Dell keyboard from cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_085] - Cart
**User Query:** `Update quantity of HP mouse to 5`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_086] - Cart
**User Query:** `Change qty of monitor to 1`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_087] - Cart
**User Query:** `Show my cart items`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_088] - Cart
**User Query:** `View my shopping cart`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_089] - Cart
**User Query:** `Clear my entire cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_090] - Cart
**User Query:** `Empty the cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_091] - Cart
**User Query:** `Add Intel charger to my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_092] - Cart
**User Query:** `Put the AMD cable in cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_093] - Cart
**User Query:** `Remove Nvidia backpack from cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_094] - Cart
**User Query:** `Update quantity of Xiaomi desk lamp to 4`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_095] - Cart
**User Query:** `Change qty of router to 5`

**Expected Goal (Intent):** `UPDATE_CART_QUANTITY` | **Expected Action:** `UPDATE_CART_QUANTITY`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_096] - Cart
**User Query:** `Show my cart items`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_097] - Cart
**User Query:** `View my shopping cart`

**Expected Goal (Intent):** `VIEW_CART` | **Expected Action:** `VIEW_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_098] - Cart
**User Query:** `Clear my entire cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_099] - Cart
**User Query:** `Empty the cart`

**Expected Goal (Intent):** `REMOVE_CART` | **Expected Action:** `REMOVE_FROM_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CART_100] - Cart
**User Query:** `Add Dell graphics card to my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `ADD_TO_CART`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_001] - Checkout
**User Query:** `I want to checkout now 0`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_002] - Checkout
**User Query:** `Place my order please 1`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_003] - Checkout
**User Query:** `Proceed to checkout 2`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_004] - Checkout
**User Query:** `Go to payment page 3`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_005] - Checkout
**User Query:** `Complete my purchase 4`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_006] - Checkout
**User Query:** `Start checkout process 5`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_007] - Checkout
**User Query:** `I want to checkout now 6`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_008] - Checkout
**User Query:** `Place my order please 7`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_009] - Checkout
**User Query:** `Proceed to checkout 8`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_010] - Checkout
**User Query:** `Go to payment page 9`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_011] - Checkout
**User Query:** `Complete my purchase 10`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_012] - Checkout
**User Query:** `Start checkout process 11`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_013] - Checkout
**User Query:** `I want to checkout now 12`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_014] - Checkout
**User Query:** `Place my order please 13`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_015] - Checkout
**User Query:** `Proceed to checkout 14`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_016] - Checkout
**User Query:** `Go to payment page 15`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_017] - Checkout
**User Query:** `Complete my purchase 16`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_018] - Checkout
**User Query:** `Start checkout process 17`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_019] - Checkout
**User Query:** `I want to checkout now 18`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_020] - Checkout
**User Query:** `Place my order please 19`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_021] - Checkout
**User Query:** `Proceed to checkout 20`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_022] - Checkout
**User Query:** `Go to payment page 21`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_023] - Checkout
**User Query:** `Complete my purchase 22`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_024] - Checkout
**User Query:** `Start checkout process 23`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_025] - Checkout
**User Query:** `I want to checkout now 24`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_026] - Checkout
**User Query:** `Place my order please 25`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_027] - Checkout
**User Query:** `Proceed to checkout 26`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_028] - Checkout
**User Query:** `Go to payment page 27`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_029] - Checkout
**User Query:** `Complete my purchase 28`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_030] - Checkout
**User Query:** `Start checkout process 29`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_031] - Checkout
**User Query:** `I want to checkout now 30`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_032] - Checkout
**User Query:** `Place my order please 31`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_033] - Checkout
**User Query:** `Proceed to checkout 32`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_034] - Checkout
**User Query:** `Go to payment page 33`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_035] - Checkout
**User Query:** `Complete my purchase 34`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_036] - Checkout
**User Query:** `Start checkout process 35`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_037] - Checkout
**User Query:** `I want to checkout now 36`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_038] - Checkout
**User Query:** `Place my order please 37`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_039] - Checkout
**User Query:** `Proceed to checkout 38`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_040] - Checkout
**User Query:** `Go to payment page 39`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_041] - Checkout
**User Query:** `Complete my purchase 40`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_042] - Checkout
**User Query:** `Start checkout process 41`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_043] - Checkout
**User Query:** `I want to checkout now 42`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_044] - Checkout
**User Query:** `Place my order please 43`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_045] - Checkout
**User Query:** `Proceed to checkout 44`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_046] - Checkout
**User Query:** `Go to payment page 45`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_047] - Checkout
**User Query:** `Complete my purchase 46`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_048] - Checkout
**User Query:** `Start checkout process 47`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_049] - Checkout
**User Query:** `I want to checkout now 48`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_050] - Checkout
**User Query:** `Place my order please 49`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_051] - Checkout
**User Query:** `Proceed to checkout 50`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_052] - Checkout
**User Query:** `Go to payment page 51`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_053] - Checkout
**User Query:** `Complete my purchase 52`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_054] - Checkout
**User Query:** `Start checkout process 53`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_055] - Checkout
**User Query:** `I want to checkout now 54`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_056] - Checkout
**User Query:** `Place my order please 55`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_057] - Checkout
**User Query:** `Proceed to checkout 56`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_058] - Checkout
**User Query:** `Go to payment page 57`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_059] - Checkout
**User Query:** `Complete my purchase 58`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_060] - Checkout
**User Query:** `Start checkout process 59`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_061] - Checkout
**User Query:** `I want to checkout now 60`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_062] - Checkout
**User Query:** `Place my order please 61`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_063] - Checkout
**User Query:** `Proceed to checkout 62`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_064] - Checkout
**User Query:** `Go to payment page 63`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_065] - Checkout
**User Query:** `Complete my purchase 64`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_066] - Checkout
**User Query:** `Start checkout process 65`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_067] - Checkout
**User Query:** `I want to checkout now 66`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_068] - Checkout
**User Query:** `Place my order please 67`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_069] - Checkout
**User Query:** `Proceed to checkout 68`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_070] - Checkout
**User Query:** `Go to payment page 69`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_071] - Checkout
**User Query:** `Complete my purchase 70`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_072] - Checkout
**User Query:** `Start checkout process 71`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_073] - Checkout
**User Query:** `I want to checkout now 72`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_074] - Checkout
**User Query:** `Place my order please 73`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_075] - Checkout
**User Query:** `Proceed to checkout 74`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_076] - Checkout
**User Query:** `Go to payment page 75`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_077] - Checkout
**User Query:** `Complete my purchase 76`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_078] - Checkout
**User Query:** `Start checkout process 77`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_079] - Checkout
**User Query:** `I want to checkout now 78`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_080] - Checkout
**User Query:** `Place my order please 79`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_081] - Checkout
**User Query:** `Proceed to checkout 80`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_082] - Checkout
**User Query:** `Go to payment page 81`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_083] - Checkout
**User Query:** `Complete my purchase 82`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_084] - Checkout
**User Query:** `Start checkout process 83`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_085] - Checkout
**User Query:** `I want to checkout now 84`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_086] - Checkout
**User Query:** `Place my order please 85`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_087] - Checkout
**User Query:** `Proceed to checkout 86`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_088] - Checkout
**User Query:** `Go to payment page 87`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_089] - Checkout
**User Query:** `Complete my purchase 88`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_090] - Checkout
**User Query:** `Start checkout process 89`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_091] - Checkout
**User Query:** `I want to checkout now 90`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_092] - Checkout
**User Query:** `Place my order please 91`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_093] - Checkout
**User Query:** `Proceed to checkout 92`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_094] - Checkout
**User Query:** `Go to payment page 93`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_095] - Checkout
**User Query:** `Complete my purchase 94`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_096] - Checkout
**User Query:** `Start checkout process 95`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_097] - Checkout
**User Query:** `I want to checkout now 96`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_098] - Checkout
**User Query:** `Place my order please 97`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_099] - Checkout
**User Query:** `Proceed to checkout 98`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [CHECKOUT_100] - Checkout
**User Query:** `Go to payment page 99`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `CHECKOUT`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_001] - Orders
**User Query:** `Where is my order #1000?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_002] - Orders
**User Query:** `Track my package #1001`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_003] - Orders
**User Query:** `Order status for #1002`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_004] - Orders
**User Query:** `Check status of order 1003`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_005] - Orders
**User Query:** `When will order #1004 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_006] - Orders
**User Query:** `Where is my order #1005?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_007] - Orders
**User Query:** `Track my package #1006`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_008] - Orders
**User Query:** `Order status for #1007`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_009] - Orders
**User Query:** `Check status of order 1008`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_010] - Orders
**User Query:** `When will order #1009 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_011] - Orders
**User Query:** `Where is my order #1010?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_012] - Orders
**User Query:** `Track my package #1011`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_013] - Orders
**User Query:** `Order status for #1012`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_014] - Orders
**User Query:** `Check status of order 1013`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_015] - Orders
**User Query:** `When will order #1014 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_016] - Orders
**User Query:** `Where is my order #1015?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_017] - Orders
**User Query:** `Track my package #1016`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_018] - Orders
**User Query:** `Order status for #1017`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_019] - Orders
**User Query:** `Check status of order 1018`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_020] - Orders
**User Query:** `When will order #1019 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_021] - Orders
**User Query:** `Where is my order #1020?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_022] - Orders
**User Query:** `Track my package #1021`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_023] - Orders
**User Query:** `Order status for #1022`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_024] - Orders
**User Query:** `Check status of order 1023`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_025] - Orders
**User Query:** `When will order #1024 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_026] - Orders
**User Query:** `Where is my order #1025?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_027] - Orders
**User Query:** `Track my package #1026`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_028] - Orders
**User Query:** `Order status for #1027`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_029] - Orders
**User Query:** `Check status of order 1028`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_030] - Orders
**User Query:** `When will order #1029 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_031] - Orders
**User Query:** `Where is my order #1030?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_032] - Orders
**User Query:** `Track my package #1031`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_033] - Orders
**User Query:** `Order status for #1032`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_034] - Orders
**User Query:** `Check status of order 1033`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_035] - Orders
**User Query:** `When will order #1034 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_036] - Orders
**User Query:** `Where is my order #1035?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_037] - Orders
**User Query:** `Track my package #1036`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_038] - Orders
**User Query:** `Order status for #1037`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_039] - Orders
**User Query:** `Check status of order 1038`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_040] - Orders
**User Query:** `When will order #1039 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_041] - Orders
**User Query:** `Where is my order #1040?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_042] - Orders
**User Query:** `Track my package #1041`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_043] - Orders
**User Query:** `Order status for #1042`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_044] - Orders
**User Query:** `Check status of order 1043`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_045] - Orders
**User Query:** `When will order #1044 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_046] - Orders
**User Query:** `Where is my order #1045?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_047] - Orders
**User Query:** `Track my package #1046`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_048] - Orders
**User Query:** `Order status for #1047`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_049] - Orders
**User Query:** `Check status of order 1048`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_050] - Orders
**User Query:** `When will order #1049 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_051] - Orders
**User Query:** `Where is my order #1050?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_052] - Orders
**User Query:** `Track my package #1051`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_053] - Orders
**User Query:** `Order status for #1052`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_054] - Orders
**User Query:** `Check status of order 1053`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_055] - Orders
**User Query:** `When will order #1054 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_056] - Orders
**User Query:** `Where is my order #1055?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_057] - Orders
**User Query:** `Track my package #1056`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_058] - Orders
**User Query:** `Order status for #1057`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_059] - Orders
**User Query:** `Check status of order 1058`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_060] - Orders
**User Query:** `When will order #1059 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_061] - Orders
**User Query:** `Where is my order #1060?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_062] - Orders
**User Query:** `Track my package #1061`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_063] - Orders
**User Query:** `Order status for #1062`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_064] - Orders
**User Query:** `Check status of order 1063`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_065] - Orders
**User Query:** `When will order #1064 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_066] - Orders
**User Query:** `Where is my order #1065?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_067] - Orders
**User Query:** `Track my package #1066`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_068] - Orders
**User Query:** `Order status for #1067`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_069] - Orders
**User Query:** `Check status of order 1068`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_070] - Orders
**User Query:** `When will order #1069 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_071] - Orders
**User Query:** `Where is my order #1070?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_072] - Orders
**User Query:** `Track my package #1071`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_073] - Orders
**User Query:** `Order status for #1072`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_074] - Orders
**User Query:** `Check status of order 1073`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_075] - Orders
**User Query:** `When will order #1074 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_076] - Orders
**User Query:** `Where is my order #1075?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_077] - Orders
**User Query:** `Track my package #1076`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_078] - Orders
**User Query:** `Order status for #1077`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_079] - Orders
**User Query:** `Check status of order 1078`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_080] - Orders
**User Query:** `When will order #1079 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_081] - Orders
**User Query:** `Where is my order #1080?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_082] - Orders
**User Query:** `Track my package #1081`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_083] - Orders
**User Query:** `Order status for #1082`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_084] - Orders
**User Query:** `Check status of order 1083`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_085] - Orders
**User Query:** `When will order #1084 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_086] - Orders
**User Query:** `Where is my order #1085?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_087] - Orders
**User Query:** `Track my package #1086`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_088] - Orders
**User Query:** `Order status for #1087`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_089] - Orders
**User Query:** `Check status of order 1088`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_090] - Orders
**User Query:** `When will order #1089 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_091] - Orders
**User Query:** `Where is my order #1090?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_092] - Orders
**User Query:** `Track my package #1091`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_093] - Orders
**User Query:** `Order status for #1092`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_094] - Orders
**User Query:** `Check status of order 1093`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_095] - Orders
**User Query:** `When will order #1094 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_096] - Orders
**User Query:** `Where is my order #1095?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_097] - Orders
**User Query:** `Track my package #1096`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_098] - Orders
**User Query:** `Order status for #1097`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_099] - Orders
**User Query:** `Check status of order 1098`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [ORDERS_100] - Orders
**User Query:** `When will order #1099 arrive?`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_001] - Returns
**User Query:** `I want to return my order #2000`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_002] - Returns
**User Query:** `Can I exchange order #2001?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_003] - Returns
**User Query:** `Request refund for order #2002`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_004] - Returns
**User Query:** `Exchange size for order #2003`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_005] - Returns
**User Query:** `Send back order #2004`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_006] - Returns
**User Query:** `I want to return my order #2005`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_007] - Returns
**User Query:** `Can I exchange order #2006?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_008] - Returns
**User Query:** `Request refund for order #2007`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_009] - Returns
**User Query:** `Exchange size for order #2008`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_010] - Returns
**User Query:** `Send back order #2009`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_011] - Returns
**User Query:** `I want to return my order #2010`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_012] - Returns
**User Query:** `Can I exchange order #2011?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_013] - Returns
**User Query:** `Request refund for order #2012`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_014] - Returns
**User Query:** `Exchange size for order #2013`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_015] - Returns
**User Query:** `Send back order #2014`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_016] - Returns
**User Query:** `I want to return my order #2015`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_017] - Returns
**User Query:** `Can I exchange order #2016?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_018] - Returns
**User Query:** `Request refund for order #2017`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_019] - Returns
**User Query:** `Exchange size for order #2018`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_020] - Returns
**User Query:** `Send back order #2019`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_021] - Returns
**User Query:** `I want to return my order #2020`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_022] - Returns
**User Query:** `Can I exchange order #2021?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_023] - Returns
**User Query:** `Request refund for order #2022`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_024] - Returns
**User Query:** `Exchange size for order #2023`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_025] - Returns
**User Query:** `Send back order #2024`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_026] - Returns
**User Query:** `I want to return my order #2025`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_027] - Returns
**User Query:** `Can I exchange order #2026?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_028] - Returns
**User Query:** `Request refund for order #2027`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_029] - Returns
**User Query:** `Exchange size for order #2028`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_030] - Returns
**User Query:** `Send back order #2029`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_031] - Returns
**User Query:** `I want to return my order #2030`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_032] - Returns
**User Query:** `Can I exchange order #2031?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_033] - Returns
**User Query:** `Request refund for order #2032`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_034] - Returns
**User Query:** `Exchange size for order #2033`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_035] - Returns
**User Query:** `Send back order #2034`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_036] - Returns
**User Query:** `I want to return my order #2035`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_037] - Returns
**User Query:** `Can I exchange order #2036?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_038] - Returns
**User Query:** `Request refund for order #2037`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_039] - Returns
**User Query:** `Exchange size for order #2038`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_040] - Returns
**User Query:** `Send back order #2039`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_041] - Returns
**User Query:** `I want to return my order #2040`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_042] - Returns
**User Query:** `Can I exchange order #2041?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_043] - Returns
**User Query:** `Request refund for order #2042`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_044] - Returns
**User Query:** `Exchange size for order #2043`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_045] - Returns
**User Query:** `Send back order #2044`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_046] - Returns
**User Query:** `I want to return my order #2045`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_047] - Returns
**User Query:** `Can I exchange order #2046?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_048] - Returns
**User Query:** `Request refund for order #2047`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_049] - Returns
**User Query:** `Exchange size for order #2048`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_050] - Returns
**User Query:** `Send back order #2049`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_051] - Returns
**User Query:** `I want to return my order #2050`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_052] - Returns
**User Query:** `Can I exchange order #2051?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_053] - Returns
**User Query:** `Request refund for order #2052`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_054] - Returns
**User Query:** `Exchange size for order #2053`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_055] - Returns
**User Query:** `Send back order #2054`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_056] - Returns
**User Query:** `I want to return my order #2055`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_057] - Returns
**User Query:** `Can I exchange order #2056?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_058] - Returns
**User Query:** `Request refund for order #2057`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_059] - Returns
**User Query:** `Exchange size for order #2058`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_060] - Returns
**User Query:** `Send back order #2059`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_061] - Returns
**User Query:** `I want to return my order #2060`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_062] - Returns
**User Query:** `Can I exchange order #2061?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_063] - Returns
**User Query:** `Request refund for order #2062`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_064] - Returns
**User Query:** `Exchange size for order #2063`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_065] - Returns
**User Query:** `Send back order #2064`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_066] - Returns
**User Query:** `I want to return my order #2065`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_067] - Returns
**User Query:** `Can I exchange order #2066?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_068] - Returns
**User Query:** `Request refund for order #2067`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_069] - Returns
**User Query:** `Exchange size for order #2068`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_070] - Returns
**User Query:** `Send back order #2069`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_071] - Returns
**User Query:** `I want to return my order #2070`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_072] - Returns
**User Query:** `Can I exchange order #2071?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_073] - Returns
**User Query:** `Request refund for order #2072`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_074] - Returns
**User Query:** `Exchange size for order #2073`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_075] - Returns
**User Query:** `Send back order #2074`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_076] - Returns
**User Query:** `I want to return my order #2075`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_077] - Returns
**User Query:** `Can I exchange order #2076?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_078] - Returns
**User Query:** `Request refund for order #2077`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_079] - Returns
**User Query:** `Exchange size for order #2078`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_080] - Returns
**User Query:** `Send back order #2079`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_081] - Returns
**User Query:** `I want to return my order #2080`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_082] - Returns
**User Query:** `Can I exchange order #2081?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_083] - Returns
**User Query:** `Request refund for order #2082`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_084] - Returns
**User Query:** `Exchange size for order #2083`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_085] - Returns
**User Query:** `Send back order #2084`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_086] - Returns
**User Query:** `I want to return my order #2085`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_087] - Returns
**User Query:** `Can I exchange order #2086?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_088] - Returns
**User Query:** `Request refund for order #2087`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_089] - Returns
**User Query:** `Exchange size for order #2088`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_090] - Returns
**User Query:** `Send back order #2089`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_091] - Returns
**User Query:** `I want to return my order #2090`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_092] - Returns
**User Query:** `Can I exchange order #2091?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_093] - Returns
**User Query:** `Request refund for order #2092`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_094] - Returns
**User Query:** `Exchange size for order #2093`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_095] - Returns
**User Query:** `Send back order #2094`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_096] - Returns
**User Query:** `I want to return my order #2095`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_097] - Returns
**User Query:** `Can I exchange order #2096?`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_098] - Returns
**User Query:** `Request refund for order #2097`

**Expected Goal (Intent):** `REFUND` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_099] - Returns
**User Query:** `Exchange size for order #2098`

**Expected Goal (Intent):** `EXCHANGE_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [RETURNS_100] - Returns
**User Query:** `Send back order #2099`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_001] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 0)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_002] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 1)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_003] - Support
**User Query:** `Connect me to a live agent (Ref: 2)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_004] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 3)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_005] - Support
**User Query:** `Escalate this to customer care (Ref: 4)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_006] - Support
**User Query:** `Open a customer service ticket (Ref: 5)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_007] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 6)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_008] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 7)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_009] - Support
**User Query:** `Connect me to a live agent (Ref: 8)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_010] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 9)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_011] - Support
**User Query:** `Escalate this to customer care (Ref: 10)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_012] - Support
**User Query:** `Open a customer service ticket (Ref: 11)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_013] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 12)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_014] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 13)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_015] - Support
**User Query:** `Connect me to a live agent (Ref: 14)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_016] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 15)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_017] - Support
**User Query:** `Escalate this to customer care (Ref: 16)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_018] - Support
**User Query:** `Open a customer service ticket (Ref: 17)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_019] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 18)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_020] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 19)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_021] - Support
**User Query:** `Connect me to a live agent (Ref: 20)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_022] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 21)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_023] - Support
**User Query:** `Escalate this to customer care (Ref: 22)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_024] - Support
**User Query:** `Open a customer service ticket (Ref: 23)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_025] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 24)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_026] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 25)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_027] - Support
**User Query:** `Connect me to a live agent (Ref: 26)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_028] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 27)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_029] - Support
**User Query:** `Escalate this to customer care (Ref: 28)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_030] - Support
**User Query:** `Open a customer service ticket (Ref: 29)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_031] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 30)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_032] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 31)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_033] - Support
**User Query:** `Connect me to a live agent (Ref: 32)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_034] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 33)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_035] - Support
**User Query:** `Escalate this to customer care (Ref: 34)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_036] - Support
**User Query:** `Open a customer service ticket (Ref: 35)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_037] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 36)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_038] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 37)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_039] - Support
**User Query:** `Connect me to a live agent (Ref: 38)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_040] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 39)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_041] - Support
**User Query:** `Escalate this to customer care (Ref: 40)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_042] - Support
**User Query:** `Open a customer service ticket (Ref: 41)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_043] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 42)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_044] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 43)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_045] - Support
**User Query:** `Connect me to a live agent (Ref: 44)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_046] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 45)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_047] - Support
**User Query:** `Escalate this to customer care (Ref: 46)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_048] - Support
**User Query:** `Open a customer service ticket (Ref: 47)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_049] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 48)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_050] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 49)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_051] - Support
**User Query:** `Connect me to a live agent (Ref: 50)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_052] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 51)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_053] - Support
**User Query:** `Escalate this to customer care (Ref: 52)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_054] - Support
**User Query:** `Open a customer service ticket (Ref: 53)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_055] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 54)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_056] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 55)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_057] - Support
**User Query:** `Connect me to a live agent (Ref: 56)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_058] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 57)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_059] - Support
**User Query:** `Escalate this to customer care (Ref: 58)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_060] - Support
**User Query:** `Open a customer service ticket (Ref: 59)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_061] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 60)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_062] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 61)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_063] - Support
**User Query:** `Connect me to a live agent (Ref: 62)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_064] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 63)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_065] - Support
**User Query:** `Escalate this to customer care (Ref: 64)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_066] - Support
**User Query:** `Open a customer service ticket (Ref: 65)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_067] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 66)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_068] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 67)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_069] - Support
**User Query:** `Connect me to a live agent (Ref: 68)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_070] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 69)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_071] - Support
**User Query:** `Escalate this to customer care (Ref: 70)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_072] - Support
**User Query:** `Open a customer service ticket (Ref: 71)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_073] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 72)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_074] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 73)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_075] - Support
**User Query:** `Connect me to a live agent (Ref: 74)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_076] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 75)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_077] - Support
**User Query:** `Escalate this to customer care (Ref: 76)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_078] - Support
**User Query:** `Open a customer service ticket (Ref: 77)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_079] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 78)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_080] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 79)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_081] - Support
**User Query:** `Connect me to a live agent (Ref: 80)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_082] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 81)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_083] - Support
**User Query:** `Escalate this to customer care (Ref: 82)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_084] - Support
**User Query:** `Open a customer service ticket (Ref: 83)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_085] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 84)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_086] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 85)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_087] - Support
**User Query:** `Connect me to a live agent (Ref: 86)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_088] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 87)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_089] - Support
**User Query:** `Escalate this to customer care (Ref: 88)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_090] - Support
**User Query:** `Open a customer service ticket (Ref: 89)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_091] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 90)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_092] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 91)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_093] - Support
**User Query:** `Connect me to a live agent (Ref: 92)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_094] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 93)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_095] - Support
**User Query:** `Escalate this to customer care (Ref: 94)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_096] - Support
**User Query:** `Open a customer service ticket (Ref: 95)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_097] - Support
**User Query:** `Create a support ticket for my broken item (Ref: 96)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_098] - Support
**User Query:** `I need to file a complaint about my delivery (Ref: 97)`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_099] - Support
**User Query:** `Connect me to a live agent (Ref: 98)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [SUPPORT_100] - Support
**User Query:** `Can I talk to a human support representative? (Ref: 99)`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_001] - Typos
**User Query:** `smasung phone 0`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_002] - Typos
**User Query:** `iphon details 1`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_003] - Typos
**User Query:** `retrn my ordr 2`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_004] - Typos
**User Query:** `paymnt failed 3`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_005] - Typos
**User Query:** `add to crat 4`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_006] - Typos
**User Query:** `view my orderss 5`

**Expected Goal (Intent):** `VIEW_ORDERS` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_007] - Typos
**User Query:** `compere dell vs hp 6`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_008] - Typos
**User Query:** `where is my pakage 7`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_009] - Typos
**User Query:** `support tickt 8`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_010] - Typos
**User Query:** `human agentt 9`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_011] - Typos
**User Query:** `smasung phone 10`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_012] - Typos
**User Query:** `iphon details 11`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_013] - Typos
**User Query:** `retrn my ordr 12`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_014] - Typos
**User Query:** `paymnt failed 13`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_015] - Typos
**User Query:** `add to crat 14`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_016] - Typos
**User Query:** `view my orderss 15`

**Expected Goal (Intent):** `VIEW_ORDERS` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_017] - Typos
**User Query:** `compere dell vs hp 16`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_018] - Typos
**User Query:** `where is my pakage 17`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_019] - Typos
**User Query:** `support tickt 18`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_020] - Typos
**User Query:** `human agentt 19`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_021] - Typos
**User Query:** `smasung phone 20`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_022] - Typos
**User Query:** `iphon details 21`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_023] - Typos
**User Query:** `retrn my ordr 22`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_024] - Typos
**User Query:** `paymnt failed 23`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_025] - Typos
**User Query:** `add to crat 24`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_026] - Typos
**User Query:** `view my orderss 25`

**Expected Goal (Intent):** `VIEW_ORDERS` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_027] - Typos
**User Query:** `compere dell vs hp 26`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_028] - Typos
**User Query:** `where is my pakage 27`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_029] - Typos
**User Query:** `support tickt 28`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_030] - Typos
**User Query:** `human agentt 29`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_031] - Typos
**User Query:** `smasung phone 30`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_032] - Typos
**User Query:** `iphon details 31`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_033] - Typos
**User Query:** `retrn my ordr 32`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_034] - Typos
**User Query:** `paymnt failed 33`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_035] - Typos
**User Query:** `add to crat 34`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_036] - Typos
**User Query:** `view my orderss 35`

**Expected Goal (Intent):** `VIEW_ORDERS` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_037] - Typos
**User Query:** `compere dell vs hp 36`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_038] - Typos
**User Query:** `where is my pakage 37`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_039] - Typos
**User Query:** `support tickt 38`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_040] - Typos
**User Query:** `human agentt 39`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_041] - Typos
**User Query:** `smasung phone 40`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_042] - Typos
**User Query:** `iphon details 41`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_043] - Typos
**User Query:** `retrn my ordr 42`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_044] - Typos
**User Query:** `paymnt failed 43`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_045] - Typos
**User Query:** `add to crat 44`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_046] - Typos
**User Query:** `view my orderss 45`

**Expected Goal (Intent):** `VIEW_ORDERS` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_047] - Typos
**User Query:** `compere dell vs hp 46`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_048] - Typos
**User Query:** `where is my pakage 47`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_049] - Typos
**User Query:** `support tickt 48`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_050] - Typos
**User Query:** `human agentt 49`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_051] - Typos
**User Query:** `smasung phone 50`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_052] - Typos
**User Query:** `iphon details 51`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_053] - Typos
**User Query:** `retrn my ordr 52`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_054] - Typos
**User Query:** `paymnt failed 53`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_055] - Typos
**User Query:** `add to crat 54`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_056] - Typos
**User Query:** `view my orderss 55`

**Expected Goal (Intent):** `VIEW_ORDERS` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_057] - Typos
**User Query:** `compere dell vs hp 56`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_058] - Typos
**User Query:** `where is my pakage 57`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_059] - Typos
**User Query:** `support tickt 58`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_060] - Typos
**User Query:** `human agentt 59`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_061] - Typos
**User Query:** `smasung phone 60`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_062] - Typos
**User Query:** `iphon details 61`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_063] - Typos
**User Query:** `retrn my ordr 62`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_064] - Typos
**User Query:** `paymnt failed 63`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_065] - Typos
**User Query:** `add to crat 64`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_066] - Typos
**User Query:** `view my orderss 65`

**Expected Goal (Intent):** `VIEW_ORDERS` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_067] - Typos
**User Query:** `compere dell vs hp 66`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_068] - Typos
**User Query:** `where is my pakage 67`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_069] - Typos
**User Query:** `support tickt 68`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_070] - Typos
**User Query:** `human agentt 69`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_071] - Typos
**User Query:** `smasung phone 70`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_072] - Typos
**User Query:** `iphon details 71`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_073] - Typos
**User Query:** `retrn my ordr 72`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_074] - Typos
**User Query:** `paymnt failed 73`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_075] - Typos
**User Query:** `add to crat 74`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_076] - Typos
**User Query:** `view my orderss 75`

**Expected Goal (Intent):** `VIEW_ORDERS` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_077] - Typos
**User Query:** `compere dell vs hp 76`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_078] - Typos
**User Query:** `where is my pakage 77`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_079] - Typos
**User Query:** `support tickt 78`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_080] - Typos
**User Query:** `human agentt 79`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_081] - Typos
**User Query:** `smasung phone 80`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_082] - Typos
**User Query:** `iphon details 81`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_083] - Typos
**User Query:** `retrn my ordr 82`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_084] - Typos
**User Query:** `paymnt failed 83`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_085] - Typos
**User Query:** `add to crat 84`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_086] - Typos
**User Query:** `view my orderss 85`

**Expected Goal (Intent):** `VIEW_ORDERS` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_087] - Typos
**User Query:** `compere dell vs hp 86`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_088] - Typos
**User Query:** `where is my pakage 87`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_089] - Typos
**User Query:** `support tickt 88`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_090] - Typos
**User Query:** `human agentt 89`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_091] - Typos
**User Query:** `smasung phone 90`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_092] - Typos
**User Query:** `iphon details 91`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_093] - Typos
**User Query:** `retrn my ordr 92`

**Expected Goal (Intent):** `RETURN_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_094] - Typos
**User Query:** `paymnt failed 93`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_095] - Typos
**User Query:** `add to crat 94`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_096] - Typos
**User Query:** `view my orderss 95`

**Expected Goal (Intent):** `VIEW_ORDERS` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_097] - Typos
**User Query:** `compere dell vs hp 96`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_098] - Typos
**User Query:** `where is my pakage 97`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_099] - Typos
**User Query:** `support tickt 98`

**Expected Goal (Intent):** `CREATE_TICKET` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [TYPOS_100] - Typos
**User Query:** `human agentt 99`

**Expected Goal (Intent):** `ESCALATE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_001] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 0)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_002] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 1)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_003] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 2)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_004] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 3)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_005] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 4)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_006] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 5)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_007] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 6)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_008] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 7)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_009] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 8)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_010] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 9)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_011] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 10)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_012] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 11)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_013] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 12)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_014] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 13)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_015] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 14)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_016] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 15)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_017] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 16)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_018] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 17)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_019] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 18)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_020] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 19)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_021] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 20)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_022] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 21)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_023] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 22)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_024] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 23)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_025] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 24)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_026] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 25)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_027] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 26)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_028] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 27)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_029] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 28)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_030] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 29)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_031] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 30)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_032] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 31)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_033] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 32)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_034] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 33)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_035] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 34)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_036] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 35)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_037] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 36)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_038] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 37)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_039] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 38)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_040] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 39)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_041] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 40)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_042] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 41)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_043] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 42)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_044] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 43)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_045] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 44)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_046] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 45)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_047] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 46)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_048] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 47)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_049] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 48)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_050] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 49)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_051] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 50)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_052] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 51)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_053] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 52)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_054] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 53)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_055] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 54)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_056] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 55)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_057] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 56)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_058] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 57)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_059] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 58)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_060] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 59)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_061] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 60)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_062] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 61)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_063] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 62)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_064] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 63)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_065] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 64)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_066] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 65)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_067] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 66)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_068] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 67)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_069] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 68)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_070] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 69)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_071] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 70)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_072] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 71)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_073] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 72)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_074] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 73)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_075] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 74)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_076] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 75)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_077] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 76)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_078] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 77)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_079] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 78)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_080] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 79)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_081] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 80)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_082] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 81)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_083] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 82)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_084] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 83)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_085] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 84)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_086] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 85)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_087] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 86)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_088] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 87)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_089] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 88)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_090] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 89)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_091] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 90)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_092] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 91)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_093] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 92)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_094] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 93)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_095] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 94)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_096] - Multi Intent
**User Query:** `Track my order and change delivery address (Ref 95)`

**Expected Goal (Intent):** `TRACK_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_097] - Multi Intent
**User Query:** `Cancel order and refund my payment (Ref 96)`

**Expected Goal (Intent):** `CANCEL_ORDER` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_098] - Multi Intent
**User Query:** `Compare products and recommend the best one (Ref 97)`

**Expected Goal (Intent):** `COMPARE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_099] - Multi Intent
**User Query:** `Add keyboard to cart and go to checkout (Ref 98)`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [MULTI_100] - Multi Intent
**User Query:** `Show my profile info and edit my email address (Ref 99)`

**Expected Goal (Intent):** `VIEW_PROFILE` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_001] - Follow-Ups
**User Query:** `I need a new laptop`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_006] - Follow-Ups
**User Query:** `I need a new phone`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_011] - Follow-Ups
**User Query:** `I need a new headphones`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_016] - Follow-Ups
**User Query:** `I need a new keyboard`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_021] - Follow-Ups
**User Query:** `I need a new mouse`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_026] - Follow-Ups
**User Query:** `I need a new monitor`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_031] - Follow-Ups
**User Query:** `I need a new camera`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_036] - Follow-Ups
**User Query:** `I need a new smartwatch`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_041] - Follow-Ups
**User Query:** `I need a new speaker`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_046] - Follow-Ups
**User Query:** `I need a new tablet`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_051] - Follow-Ups
**User Query:** `I need a new charger`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_056] - Follow-Ups
**User Query:** `I need a new cable`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_061] - Follow-Ups
**User Query:** `I need a new backpack`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_066] - Follow-Ups
**User Query:** `I need a new desk lamp`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_071] - Follow-Ups
**User Query:** `I need a new router`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_076] - Follow-Ups
**User Query:** `I need a new microphone`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_081] - Follow-Ups
**User Query:** `I need a new projector`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_086] - Follow-Ups
**User Query:** `I need a new earbuds`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_091] - Follow-Ups
**User Query:** `I need a new hard drive`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_096] - Follow-Ups
**User Query:** `I need a new graphics card`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_002] - Follow-Ups
**User Query:** `Show me Apple`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_007] - Follow-Ups
**User Query:** `Show me Samsung`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_012] - Follow-Ups
**User Query:** `Show me Sony`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_017] - Follow-Ups
**User Query:** `Show me Dell`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_022] - Follow-Ups
**User Query:** `Show me HP`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_027] - Follow-Ups
**User Query:** `Show me Lenovo`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_032] - Follow-Ups
**User Query:** `Show me Asus`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_037] - Follow-Ups
**User Query:** `Show me Logitech`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_042] - Follow-Ups
**User Query:** `Show me Bose`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_047] - Follow-Ups
**User Query:** `Show me LG`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_052] - Follow-Ups
**User Query:** `Show me Intel`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_057] - Follow-Ups
**User Query:** `Show me AMD`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_062] - Follow-Ups
**User Query:** `Show me Nvidia`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_067] - Follow-Ups
**User Query:** `Show me Xiaomi`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_072] - Follow-Ups
**User Query:** `Show me OnePlus`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_077] - Follow-Ups
**User Query:** `Show me Microsoft`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_082] - Follow-Ups
**User Query:** `Show me Apple`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_087] - Follow-Ups
**User Query:** `Show me Samsung`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_092] - Follow-Ups
**User Query:** `Show me Sony`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_097] - Follow-Ups
**User Query:** `Show me Dell`

**Expected Goal (Intent):** `SEARCH_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_003] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_008] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_013] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_018] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_023] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_028] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_033] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_038] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_043] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_048] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_053] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_058] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_063] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_068] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_073] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_078] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_083] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_088] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_093] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_098] - Follow-Ups
**User Query:** `What is the return policy?`

**Expected Goal (Intent):** `GET_PRODUCT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_004] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_009] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_014] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_019] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_024] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_029] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_034] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_039] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_044] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_049] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_054] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_059] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_064] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_069] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_074] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_079] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_084] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_089] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_094] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_099] - Follow-Ups
**User Query:** `Put it in my cart`

**Expected Goal (Intent):** `ADD_CART` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_005] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_010] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_015] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_020] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_025] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_030] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_035] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_040] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_045] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_050] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_055] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_060] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_065] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_070] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_075] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_080] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_085] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_090] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_095] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---

### [FOLLOW_UP_100] - Follow-Ups
**User Query:** `Go to checkout`

**Expected Goal (Intent):** `CHECKOUT` | **Expected Action:** `None`

**Actual Intent:** `ERROR_OR_TIMEOUT` | **Result Status:** `FAIL` | **Confidence:** `0%`

**Actual Response:**
```
Failed to contact Chatbot API: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

**Evaluation Diagnosis:**
> Network or Server error: HTTP 429: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}

---


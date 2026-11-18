<!-- StudyTantra - Student Dashboard (Sahara Edition) -->
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;family=Manrope:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "surface-tint": "#c2652a", "on-tertiary-fixed": "#2e1515", "on-secondary-container": "#605850", "outline": "#9a9088", "background": "#faf5ee", "on-background": "#3a302a", "surface-container-lowest": "#ffffff", "on-error-container": "#7a1a10", "on-tertiary": "#ffffff", "inverse-on-surface": "#faf5ee", "surface-bright": "#faf5ee", "tertiary-fixed-dim": "#e8a0a0", "on-surface": "#3a302a", "on-secondary-fixed-variant": "#504840", "on-surface-variant": "#605850", "primary": "#c2652a", "primary-fixed": "#fbe8d8", "tertiary-fixed": "#fce0e0", "surface-dim": "#dcd6cc", "on-secondary-fixed": "#2a2420", "on-secondary": "#ffffff", "surface-variant": "#ece6dc", "tertiary-container": "#d47070", "primary-fixed-dim": "#f0a878", "error": "#c0392b", "surface-container-high": "#ece6dc", "tertiary": "#8c3c3c", "on-tertiary-container": "#3a2020", "primary-container": "#e08850", "on-error": "#ffffff", "secondary": "#78706a", "outline-variant": "#d8d0c8", "secondary-fixed": "#eae2da", "secondary-container": "#eae2da", "surface-container-low": "#f6f0e8", "secondary-fixed-dim": "#cec6be", "on-primary-fixed-variant": "#8a4518", "surface": "#faf5ee", "on-tertiary-fixed-variant": "#6e3030", "inverse-surface": "#3a302a", "on-primary": "#ffffff", "on-primary-fixed": "#401a08", "surface-container-highest": "#e6e0d6", "inverse-primary": "#f0a878", "on-primary-container": "#fbe8d8", "surface-container": "#f2ece4", "error-container": "#fce4e0" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": {}, "fontFamily": { "headline": [ "EB Garamond" ], "display": [ "EB Garamond" ], "body": [ "Manrope" ], "label": [ "Manrope" ] }, "fontSize": {} } } }</script></head><body class="bg-background font-body text-on-surface antialiased"><aside class="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between py-6 px-4 shadow-[0_1px_8px_rgba(58,48,42,0.04)]"><div class="flex flex-col gap-8"><div class="flex items-center gap-3 px-4"><div class="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[24px]">local_library</span></div><div><span class="font-headline font-semibold text-2xl tracking-tight text-on-surface block leading-none">StudyTantra</span><span class="text-[11px] font-label uppercase tracking-widest text-primary font-semibold mt-1 block">AI Spaced Recall</span></div></div><nav class="flex flex-col gap-1.5" data-active-classes="bg-primary text-on-primary font-medium shadow-[0_2px_12px_rgba(194,101,42,0.18)]"><a aria-current="page" class="flex items-center gap-3.5 px-4 py-2.5 rounded-lg transition-all bg-primary text-on-primary font-medium shadow-[0_2px_12px_rgba(194,101,42,0.18)]" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[20px]">grid_view</span><span>Dashboard</span></a><a class="flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="document-library" href="#"><span class="material-symbols-outlined text-[20px]">folder_open</span><span>Document Library</span></a><a class="flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="flashcards-vault" href="#"><span class="material-symbols-outlined text-[20px]">style</span><span>Flashcards Vault</span></a><a class="flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="spaced-review" href="#"><span class="material-symbols-outlined text-[20px]">update</span><span>Spaced Review</span></a><a class="flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="exam-planner" href="#"><span class="material-symbols-outlined text-[20px]">calendar_month</span><span>Exam Planner</span></a><a class="flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="quiz-engine" href="#"><span class="material-symbols-outlined text-[20px]">psychology</span><span>Quiz Engine</span></a><a class="flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" data-path="settings" href="#"><span class="material-symbols-outlined text-[20px]">settings</span><span>Settings</span></a></nav></div><div class="p-4 rounded-xl bg-surface-container flex flex-col gap-2.5"><div class="flex items-center justify-between"><span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-label">Daily Retention</span><span class="text-xs font-bold text-primary font-label">86%</span></div><div class="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden"><div class="bg-primary h-full rounded-full" style="width: 86%"></div></div><span class="text-[11px] text-on-surface-variant leading-relaxed font-body">Next optimal repetition wave starts in 3 hours.</span></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(58,48,42,0.04)]"><div class="h-16 w-full px-8 flex items-center justify-between gap-6"><div class="flex items-center gap-4 flex-1 max-w-lg"><div class="relative w-full"><span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span><input class="w-full pl-10 pr-4 py-2 text-sm bg-surface-container-lowest text-on-surface placeholder:text-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Search concepts, citations, flashcard vaults..." type="text"/></div></div><div class="flex items-center gap-5"><div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high text-xs text-on-surface-variant font-label"><span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span><span>Active Deck: <strong class="text-on-surface font-semibold">Neuroanatomy Vol. II</strong></span></div><button class="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[22px]">notifications</span><span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary"></span></button><div class="flex items-center gap-3 pl-3"><div class="flex flex-col text-right hidden md:block"><span class="text-sm font-semibold text-on-surface leading-none">Arya Sharma</span><span class="text-xs text-on-surface-variant font-label mt-0.5 leading-none">Cognitive Neuroscience</span></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></div></header><main class="w-full pt-16 bg-background min-h-screen"><div class="flex flex-col w-full">
<div class="px-8 py-8 md:px-12 md:py-10 max-w-[1400px] mx-auto w-full flex flex-col gap-10">
<!-- Section 1: Editorial Welcome & Daily Momentum Banner -->
<section class="relative overflow-hidden rounded-2xl bg-surface-container-low shadow-sm p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
<div class="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"></div>
<div class="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none"></div>
<div class="relative z-10 flex flex-col max-w-2xl">
<div class="flex items-center gap-2 mb-3">
<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase font-label bg-primary-fixed text-on-primary-fixed-variant">
            Session Wave #2 • FSRS v4.5 Optimized
          </span>
<span class="text-xs font-medium text-on-surface-variant font-label flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-primary" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
            Day 14 on Track
          </span>
</div>
<h1 class="font-headline text-4xl sm:text-5xl lg:text-5xl font-normal tracking-tight text-on-surface leading-[1.1]">
          Welcome back, Arya.
        </h1>
<p class="font-body text-base sm:text-lg text-on-surface-variant mt-3 leading-relaxed">
          You have <strong class="text-on-surface font-semibold">38 cards due today</strong> across 3 decks. Upcoming milestone: <span class="text-primary font-semibold">CS-402 DBMS</span> in 9 days.
        </p>
<!-- Metric Badges Row -->
<div class="flex flex-wrap items-center gap-3 mt-6">
<div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-lowest shadow-sm">
<span class="material-symbols-outlined text-primary text-[20px]">psychology</span>
<div class="flex flex-col">
<span class="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Retention Rate</span>
<span class="text-sm font-semibold text-on-surface font-label">91.4% <span class="text-xs font-normal text-primary">↑ 1.2%</span></span>
</div>
</div>
<div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-lowest shadow-sm">
<span class="material-symbols-outlined text-tertiary text-[20px]" style="font-variation-settings: 'FILL' 1;">bolt</span>
<div class="flex flex-col">
<span class="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Current Streak</span>
<span class="text-sm font-semibold text-on-surface font-label">14 Consecutive Days</span>
</div>
</div>
<div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-lowest shadow-sm">
<span class="material-symbols-outlined text-secondary text-[20px]">network_intelligence</span>
<div class="flex flex-col">
<span class="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Target Stability</span>
<span class="text-sm font-semibold text-on-surface font-label">90% FSRS v4.5</span>
</div>
</div>
</div>
</div>
<!-- Quick Action CTA -->
<div class="relative z-10 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3 shrink-0">
<button class="group relative inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-primary text-on-primary font-label font-medium text-sm transition-all duration-200 hover:bg-primary/95 shadow-[0_4px_20px_rgba(194,101,42,0.28)] hover:shadow-[0_6px_26px_rgba(194,101,42,0.36)] hover:-translate-y-0.5 active:translate-y-0" id="start-daily-review" type="button">
<span>Start Daily Review (38 Cards)</span>
<span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
</button>
<span class="text-xs text-on-surface-variant font-label tracking-wide flex items-center gap-1.5 self-center lg:self-end">
<span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
          Est. completion: 14 mins
        </span>
</div>
</section>
<!-- Section 2: Split Bento Grid (Main Queue & Exam Countdown Widget) -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
<!-- Spaced Repetition Due Queue (8 Cols) -->
<section class="lg:col-span-8 flex flex-col gap-5">
<div class="flex items-center justify-between">
<div>
<h2 class="font-headline text-2xl md:text-3xl text-on-surface font-normal">Active Spaced Review Queue</h2>
<p class="font-body text-xs md:text-sm text-on-surface-variant mt-0.5">Calculated by recall memory decay coefficient and optimal test intervals</p>
</div>
<span class="text-xs font-label uppercase tracking-wider text-on-surface-variant px-3 py-1 rounded-full bg-surface-container">3 Decks Pending</span>
</div>
<div class="flex flex-col gap-3.5">
<!-- Item 1: CS-402 -->
<div class="group relative rounded-xl bg-surface-container-low p-6 transition-all duration-200 hover:shadow-md hover:bg-surface-container flex flex-col md:flex-row md:items-center justify-between gap-5">
<div class="flex items-start gap-4">
<div class="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
<span class="material-symbols-outlined text-[24px]">database</span>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="text-xs font-label font-bold text-primary tracking-wide">CS-402</span>
<span class="text-xs text-on-surface-variant font-label">• 18 Cards Due</span>
<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-tertiary-fixed text-on-tertiary-fixed">High Urgency</span>
</div>
<h3 class="font-headline text-xl text-on-surface mt-1 font-semibold leading-tight">Database Management Systems</h3>
<p class="text-xs text-on-surface-variant font-body mt-1">Focus modules: Concurrency Control, Two-Phase Locking, B+ Tree Indexing</p>
<div class="flex items-center gap-3 mt-3 w-48">
<div class="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 72%"></div>
</div>
<span class="text-[11px] font-label text-on-surface-variant shrink-0">72% Mastered</span>
</div>
</div>
</div>
<div class="flex items-center md:flex-col lg:flex-row gap-2 shrink-0 self-end md:self-center">
<button class="px-4 py-2 rounded-lg bg-primary text-on-primary font-label text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5" type="button">
<span>Review Now</span>
<span class="material-symbols-outlined text-[16px]">play_arrow</span>
</button>
</div>
</div>
<!-- Item 2: MATH-301 -->
<div class="group relative rounded-xl bg-surface-container-low p-6 transition-all duration-200 hover:shadow-md hover:bg-surface-container flex flex-col md:flex-row md:items-center justify-between gap-5">
<div class="flex items-start gap-4">
<div class="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0 group-hover:scale-105 transition-transform">
<span class="material-symbols-outlined text-[24px]">functions</span>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="text-xs font-label font-bold text-secondary tracking-wide">MATH-301</span>
<span class="text-xs text-on-surface-variant font-label">• 12 Cards Due</span>
<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container-highest text-on-surface-variant">Scheduled</span>
</div>
<h3 class="font-headline text-xl text-on-surface mt-1 font-semibold leading-tight">Advanced Linear Algebra</h3>
<p class="text-xs text-on-surface-variant font-body mt-1">Focus modules: Singular Value Decomposition, Spectral Theorem &amp; Gram-Schmidt</p>
<div class="flex items-center gap-3 mt-3 w-48">
<div class="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 88%"></div>
</div>
<span class="text-[11px] font-label text-on-surface-variant shrink-0">88% Mastered</span>
</div>
</div>
</div>
<div class="flex items-center md:flex-col lg:flex-row gap-2 shrink-0 self-end md:self-center">
<button class="px-4 py-2 rounded-lg bg-surface-container-highest text-on-surface font-label text-xs font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-sm flex items-center gap-1.5" type="button">
<span>Review Now</span>
<span class="material-symbols-outlined text-[16px]">play_arrow</span>
</button>
</div>
</div>
<!-- Item 3: BIO-210 -->
<div class="group relative rounded-xl bg-surface-container-low p-6 transition-all duration-200 hover:shadow-md hover:bg-surface-container flex flex-col md:flex-row md:items-center justify-between gap-5">
<div class="flex items-start gap-4">
<div class="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0 group-hover:scale-105 transition-transform">
<span class="material-symbols-outlined text-[24px]">biotech</span>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="text-xs font-label font-bold text-tertiary tracking-wide">BIO-210</span>
<span class="text-xs text-on-surface-variant font-label">• 8 Cards Due</span>
<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container-highest text-on-surface-variant">Maintenance</span>
</div>
<h3 class="font-headline text-xl text-on-surface mt-1 font-semibold leading-tight">Molecular Cell Biology</h3>
<p class="text-xs text-on-surface-variant font-body mt-1">Focus modules: Citric Acid Cycle, G-Protein Signaling Pathways, ATP Synthase</p>
<div class="flex items-center gap-3 mt-3 w-48">
<div class="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 93%"></div>
</div>
<span class="text-[11px] font-label text-on-surface-variant shrink-0">93% Mastered</span>
</div>
</div>
</div>
<div class="flex items-center md:flex-col lg:flex-row gap-2 shrink-0 self-end md:self-center">
<button class="px-4 py-2 rounded-lg bg-surface-container-highest text-on-surface font-label text-xs font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-sm flex items-center gap-1.5" type="button">
<span>Review Now</span>
<span class="material-symbols-outlined text-[16px]">play_arrow</span>
</button>
</div>
</div>
</div>
</section>
<!-- Exam Countdown & Study Anchor (4 Cols) -->
<section class="lg:col-span-4 flex flex-col gap-5">
<div class="flex items-center justify-between">
<h2 class="font-headline text-2xl md:text-3xl text-on-surface font-normal">Exam Countdown</h2>
<span class="text-xs font-label text-primary font-semibold">Priority 1</span>
</div>
<!-- Countdown Card with Rich Sahara Aesthetic -->
<div class="relative overflow-hidden rounded-2xl bg-surface-container p-6 flex flex-col gap-6 shadow-sm">
<div class="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/10 blur-xl pointer-events-none"></div>
<div class="flex items-center justify-between">
<span class="px-2.5 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-wider bg-tertiary-fixed text-on-tertiary-fixed">
              High Priority Flag
            </span>
<span class="text-xs font-label text-on-surface-variant">May 24, 09:00 AM</span>
</div>
<div>
<span class="text-xs font-semibold uppercase tracking-wider text-primary font-label">Main Arena</span>
<h3 class="font-headline text-2xl text-on-surface font-normal mt-0.5">CS-402 Final Examination</h3>
<p class="text-xs text-on-surface-variant mt-1">Hall B3 • Engineering Complex</p>
</div>
<!-- Digital Countdown Blocks -->
<div class="grid grid-cols-4 gap-2">
<div class="bg-surface-container-lowest rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
<span class="font-headline text-2xl font-bold text-on-surface">09</span>
<span class="text-[10px] font-label text-on-surface-variant uppercase tracking-wider">Days</span>
</div>
<div class="bg-surface-container-lowest rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
<span class="font-headline text-2xl font-bold text-on-surface">14</span>
<span class="text-[10px] font-label text-on-surface-variant uppercase tracking-wider">Hours</span>
</div>
<div class="bg-surface-container-lowest rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
<span class="font-headline text-2xl font-bold text-on-surface">22</span>
<span class="text-[10px] font-label text-on-surface-variant uppercase tracking-wider">Mins</span>
</div>
<div class="bg-surface-container-lowest rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
<span class="font-headline text-2xl font-bold text-primary">45</span>
<span class="text-[10px] font-label text-on-surface-variant uppercase tracking-wider">Secs</span>
</div>
</div>
<!-- High Priority Topics -->
<div class="flex flex-col gap-2 pt-2">
<span class="text-[11px] font-label uppercase tracking-wider font-semibold text-on-surface-variant">Target Coverage Required:</span>
<div class="flex flex-col gap-1.5">
<div class="flex items-center justify-between text-xs font-body text-on-surface bg-surface-container-lowest px-3 py-2 rounded-lg">
<span class="truncate">Crash Recovery &amp; Write-Ahead Logs</span>
<span class="text-tertiary font-semibold shrink-0">64%</span>
</div>
<div class="flex items-center justify-between text-xs font-body text-on-surface bg-surface-container-lowest px-3 py-2 rounded-lg">
<span class="truncate">Distributed Commit Protocols (2PC)</span>
<span class="text-primary font-semibold shrink-0">79%</span>
</div>
<div class="flex items-center justify-between text-xs font-body text-on-surface bg-surface-container-lowest px-3 py-2 rounded-lg">
<span class="truncate">Serializability &amp; Graph Testing</span>
<span class="text-on-surface font-semibold shrink-0">94%</span>
</div>
</div>
</div>
<a class="w-full text-center py-2.5 rounded-lg bg-surface-container-highest text-on-surface hover:bg-primary-fixed hover:text-on-primary-fixed-variant text-xs font-label font-semibold transition-colors" href="#">
            Generate Focused Mock Test →
          </a>
</div>
</section>
</div>
<!-- Section 3: Cognitive Retention & Memory Curve Analytics -->
<section class="rounded-2xl bg-surface-container-low p-8 md:p-10 shadow-sm flex flex-col gap-8">
<div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<span class="text-xs font-label uppercase tracking-widest text-primary font-semibold">Ebbinghaus vs Active Retrieval</span>
<h2 class="font-headline text-3xl text-on-surface font-normal mt-1">Cognitive Retention &amp; Stability Trajectory</h2>
<p class="font-body text-sm text-on-surface-variant mt-1">Mathematical decay projection according to the Free Spaced Repetition Scheduler algorithm</p>
</div>
<div class="flex items-center gap-4 text-xs font-label">
<div class="flex items-center gap-1.5">
<span class="w-3 h-3 rounded-sm bg-primary"></span>
<span class="text-on-surface">Active Recall Resets</span>
</div>
<div class="flex items-center gap-1.5">
<span class="w-3 h-0.5 bg-outline stroke-dashed"></span>
<span class="text-on-surface-variant">Natural Forgetting Curve</span>
</div>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
<!-- Interactive Inline SVG Memory Curve Graph -->
<div class="lg:col-span-8 bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col gap-4">
<div class="flex items-center justify-between text-xs text-on-surface-variant font-label pb-2">
<span>Memory Retention (%)</span>
<span>Elapsed Timeline (Days)</span>
</div>
<!-- Scaled Inline Vector Chart -->
<div class="relative w-full h-56 sm:h-64">
<svg class="w-full h-full overflow-visible" preserveaspectratio="none" viewbox="0 0 600 220">
<!-- Horizontal grid lines -->
<line class="text-surface-variant" stroke="currentColor" stroke-dasharray="4" x1="0" x2="600" y1="20" y2="20"></line>
<line class="text-surface-variant" stroke="currentColor" stroke-dasharray="4" x1="0" x2="600" y1="70" y2="70"></line>
<line class="text-surface-variant" stroke="currentColor" stroke-dasharray="4" x1="0" x2="600" y1="120" y2="120"></line>
<line class="text-surface-variant" stroke="currentColor" stroke-dasharray="4" x1="0" x2="600" y1="170" y2="170"></line>
<!-- Passive Forgetting Decay Curve (Dotted Grey) -->
<path class="text-outline" d="M 0,20 Q 80,140 200,180 T 600,210" fill="none" opacity="0.65" stroke="currentColor" stroke-dasharray="6 4" stroke-width="2"></path>
<!-- Active Recall Wave 1 -->
<path class="text-primary" d="M 0,20 C 30,50 60,95 80,105" fill="none" stroke="currentColor" stroke-width="2.5"></path>
<line class="text-primary" stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" x1="80" x2="80" y1="105" y2="24"></line>
<!-- Active Recall Wave 2 -->
<path class="text-primary" d="M 80,24 C 130,55 170,85 200,92" fill="none" stroke="currentColor" stroke-width="2.5"></path>
<line class="text-primary" stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" x1="200" x2="200" y1="92" y2="22"></line>
<!-- Active Recall Wave 3 (Flatter decay, greater stability) -->
<path class="text-primary" d="M 200,22 C 280,45 360,65 420,70" fill="none" stroke="currentColor" stroke-width="2.5"></path>
<line class="text-primary" stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" x1="420" x2="420" y1="70" y2="21"></line>
<!-- Final Wave 4 (High stability baseline) -->
<path class="text-primary" d="M 420,21 C 490,32 540,42 600,45" fill="none" stroke="currentColor" stroke-width="3"></path>
<!-- Key points with glowing terracotta dots -->
<circle class="fill-primary stroke-surface-container-lowest" cx="80" cy="24" r="5" stroke-width="2"></circle>
<circle class="fill-primary stroke-surface-container-lowest" cx="200" cy="22" r="5" stroke-width="2"></circle>
<circle class="fill-primary stroke-surface-container-lowest" cx="420" cy="21" r="5" stroke-width="2"></circle>
<circle class="fill-primary stroke-surface-container-lowest" cx="600" cy="45" r="5" stroke-width="2"></circle>
<!-- Callout flag at Day 14 -->
<g transform="translate(380, 85)">
<rect class="fill-surface-container shadow-sm" height="42" rx="8" width="130"></rect>
<text class="fill-on-surface text-[11px] font-semibold font-label" text-anchor="middle" x="65" y="18">Day 14 Review</text>
<text class="fill-primary text-[10px] font-label font-bold" text-anchor="middle" x="65" y="32">Stability: 91.4%</text>
</g>
</svg>
</div>
<div class="flex items-center justify-between text-xs text-on-surface-variant font-label pt-2">
<span>Day 1 (Lecture)</span>
<span>Day 3 (Review 1)</span>
<span>Day 7 (Review 2)</span>
<span>Day 14 (Current)</span>
<span>Day 30 (Exam Ready)</span>
</div>
</div>
<!-- Weekly Summary & Mastery Metrics -->
<div class="lg:col-span-4 flex flex-col gap-4">
<div class="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
<span class="text-xs font-label uppercase tracking-wider text-on-surface-variant">Syllabus Absorption</span>
<div class="flex items-baseline gap-2 mt-1">
<span class="font-headline text-4xl font-normal text-on-surface">84.2%</span>
<span class="text-xs font-semibold text-primary font-label">+6.8% this week</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full mt-3 overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 84.2%"></div>
</div>
<p class="text-xs text-on-surface-variant font-body mt-2">1,248 of 1,480 targeted academic concepts verified in long-term memory buffer.</p>
</div>
<div class="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
<span class="text-xs font-label uppercase tracking-wider text-on-surface-variant">Weekly Study Output</span>
<div class="flex items-baseline gap-2 mt-1">
<span class="font-headline text-4xl font-normal text-on-surface">18.5 <span class="text-lg">hrs</span></span>
<span class="text-xs font-semibold text-on-surface-variant font-label">Goal: 20 hrs</span>
</div>
<!-- Daily Micro-bars -->
<div class="flex items-end justify-between gap-1.5 h-12 mt-4 pt-1">
<div class="flex flex-col items-center gap-1 flex-1">
<div class="w-full bg-primary-fixed rounded-t" style="height: 65%"></div>
<span class="text-[9px] font-label text-on-surface-variant">M</span>
</div>
<div class="flex flex-col items-center gap-1 flex-1">
<div class="w-full bg-primary-fixed rounded-t" style="height: 80%"></div>
<span class="text-[9px] font-label text-on-surface-variant">T</span>
</div>
<div class="flex flex-col items-center gap-1 flex-1">
<div class="w-full bg-primary rounded-t" style="height: 100%"></div>
<span class="text-[9px] font-label text-on-surface-variant font-bold text-primary">W</span>
</div>
<div class="flex flex-col items-center gap-1 flex-1">
<div class="w-full bg-primary-fixed rounded-t" style="height: 50%"></div>
<span class="text-[9px] font-label text-on-surface-variant">T</span>
</div>
<div class="flex flex-col items-center gap-1 flex-1">
<div class="w-full bg-primary-fixed rounded-t" style="height: 90%"></div>
<span class="text-[9px] font-label text-on-surface-variant">F</span>
</div>
<div class="flex flex-col items-center gap-1 flex-1">
<div class="w-full bg-secondary-fixed rounded-t" style="height: 40%"></div>
<span class="text-[9px] font-label text-on-surface-variant">S</span>
</div>
<div class="flex flex-col items-center gap-1 flex-1">
<div class="w-full bg-secondary-fixed rounded-t" style="height: 30%"></div>
<span class="text-[9px] font-label text-on-surface-variant">S</span>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Section 4: AI Extraction Hub & Document Ingestion -->
<section class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
<!-- Drag & Drop Syllabus/Textbook Upload Zone (7 Cols) -->
<div class="lg:col-span-7 rounded-2xl bg-surface-container-low p-8 shadow-sm flex flex-col justify-between gap-6">
<div>
<span class="text-xs font-label uppercase tracking-widest text-primary font-semibold">Tantra AI Neural Ingestion</span>
<h2 class="font-headline text-2xl md:text-3xl text-on-surface font-normal mt-1">Upload &amp; Auto-Synthesize</h2>
<p class="font-body text-xs md:text-sm text-on-surface-variant mt-1">Drop lecture notes, dense textbooks, or research papers. Our parser extracts core axioms and formulates cloze deletion flashcards instantly.</p>
</div>
<!-- Interactive Drop Area -->
<div class="cursor-pointer group relative rounded-xl bg-surface-container-lowest p-8 flex flex-col items-center justify-center text-center transition-all duration-200 hover:bg-surface-variant/40" id="upload-dropzone">
<div class="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-[28px]">cloud_upload</span>
</div>
<span class="font-headline text-lg text-on-surface font-medium">Drag &amp; Drop Syllabus, PDF, or Slides</span>
<p class="text-xs text-on-surface-variant font-body mt-1 max-w-sm">Supports PDF, PPTX, EPUB, DOCX up to 60MB. OCR enabled for handwritten diagrams.</p>
<div class="flex items-center gap-3 mt-4">
<span class="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label text-xs font-semibold group-hover:bg-primary group-hover:text-on-primary transition-colors">
              Browse Local Files
            </span>
<span class="text-xs text-on-surface-variant font-label">or paste web URL</span>
</div>
</div>
<div class="flex items-center justify-between text-xs text-on-surface-variant font-label pt-1">
<span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px] text-primary">auto_awesome</span> Instant LaTeX Formula Parsing</span>
<span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px] text-primary">verified</span> Multi-choice &amp; Cloze Generation</span>
</div>
</div>
<!-- Recent Document Ingestion Queue (5 Cols) -->
<div class="lg:col-span-5 rounded-2xl bg-surface-container-low p-8 shadow-sm flex flex-col justify-between gap-5">
<div class="flex items-center justify-between">
<div>
<h2 class="font-headline text-2xl text-on-surface font-normal">Recent Extractions</h2>
<p class="font-body text-xs text-on-surface-variant">Processed into active recall vaults</p>
</div>
<a class="text-xs text-primary font-semibold font-label hover:underline" href="#">Vault Library →</a>
</div>
<div class="flex flex-col gap-3">
<!-- Document 1 -->
<div class="p-3.5 rounded-xl bg-surface-container-lowest flex items-center justify-between gap-3 shadow-sm hover:bg-surface-container transition-colors">
<div class="flex items-center gap-3 min-w-0">
<div class="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
<span class="material-symbols-outlined text-[20px]">picture_as_pdf</span>
</div>
<div class="flex flex-col min-w-0">
<span class="text-xs font-semibold text-on-surface truncate font-body">Silberschatz_DB_Chapter19.pdf</span>
<span class="text-[11px] text-on-surface-variant font-label">Generated 42 cards • 6 quiz queries</span>
</div>
</div>
<span class="shrink-0 px-2 py-0.5 rounded text-[10px] font-label font-bold bg-secondary-fixed text-on-secondary-fixed">
              Parsed
            </span>
</div>
<!-- Document 2 -->
<div class="p-3.5 rounded-xl bg-surface-container-lowest flex items-center justify-between gap-3 shadow-sm hover:bg-surface-container transition-colors">
<div class="flex items-center gap-3 min-w-0">
<div class="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
<span class="material-symbols-outlined text-[20px]">description</span>
</div>
<div class="flex flex-col min-w-0">
<span class="text-xs font-semibold text-on-surface truncate font-body">Strang_Linear_Algebra_Ch4.pdf</span>
<span class="text-[11px] text-on-surface-variant font-label">Generated 28 cards • 4 proofs</span>
</div>
</div>
<span class="shrink-0 px-2 py-0.5 rounded text-[10px] font-label font-bold bg-secondary-fixed text-on-secondary-fixed">
              Parsed
            </span>
</div>
<!-- Document 3 -->
<div class="p-3.5 rounded-xl bg-surface-container-lowest flex items-center justify-between gap-3 shadow-sm hover:bg-surface-container transition-colors">
<div class="flex items-center gap-3 min-w-0">
<div class="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
<span class="material-symbols-outlined text-[20px]">menu_book</span>
</div>
<div class="flex flex-col min-w-0">
<span class="text-xs font-semibold text-on-surface truncate font-body">Molecular_Signaling_Seminar.pptx</span>
<span class="text-[11px] text-on-surface-variant font-label">Generated 19 cards • 2 diagrams</span>
</div>
</div>
<span class="shrink-0 px-2 py-0.5 rounded text-[10px] font-label font-bold bg-surface-container-highest text-on-surface-variant">
              Synced
            </span>
</div>
</div>
<button class="w-full py-2.5 rounded-xl bg-surface-container text-on-surface font-label text-xs font-semibold hover:bg-surface-variant transition-colors flex items-center justify-center gap-2" type="button">
<span class="material-symbols-outlined text-[16px]">add_circle</span>
<span>Add Custom Flashcard Manually</span>
</button>
</div>
</section>
<!-- Section 5: Editorial Visual Inspiration & Research Quote -->
<section class="rounded-2xl overflow-hidden bg-surface-container-low shadow-sm flex flex-col md:flex-row items-stretch">
<div class="md:w-1/3 relative min-h-[220px]">
<div class="bg-cover bg-center absolute inset-0 w-full h-full" data-alt="A serene warm-toned architectural study sanctuary bathed in natural golden hour sunlight, terracotta surfaces, books on minimal wooden library tables, clean desert minimalism aesthetic" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuC1rhleomVMMMe0kLwtcAeat65eWCwTw-BxdSddYpdrW3XKD-uw7Z8DW_YFx-pbNd2q2mNSgTZiiJLdaWSF-9tAKSawRrjmNpXEVeAfHARyT1uXgkjCH57bY6bKEQ05SuibysmSzAFHsb-seXbsMJ-GymEBsr_qYVkR6wxOlDcL31rOUVbx4x8rsFrp9Gwx9zxZMgPIyq0qG8IBMdQHgLBEM0I7ZLv2SP06thwKXPAK')"></div>
<div class="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-surface-container-low via-transparent to-transparent"></div>
</div>
<div class="p-8 md:p-10 md:w-2/3 flex flex-col justify-center gap-3">
<span class="text-[11px] font-label uppercase tracking-widest text-primary font-bold">The StudyTantra Doctrine</span>
<blockquote class="font-headline text-2xl sm:text-3xl text-on-surface leading-snug font-normal italic">
          “Memory is not a static repository; it is an active reconstruction refined at each critical threshold of forgetting.”
        </blockquote>
<div class="flex items-center gap-3 mt-2">
<span class="text-xs font-semibold text-on-surface font-body">Dr. Hermann Ebbinghaus</span>
<span class="text-xs text-on-surface-variant font-label">Memory: A Contribution to Experimental Psychology</span>
</div>
</div>
</section>
</div>
</div>
<script>
  (function() {
    const reviewBtn = document.getElementById('start-daily-review');
    if (reviewBtn) {
      reviewBtn.addEventListener('click', function() {
        const originalText = reviewBtn.innerHTML;
        reviewBtn.innerHTML = `
          <span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
          <span>Loading Active Deck...</span>
        `;
        setTimeout(() => {
          reviewBtn.innerHTML = `
            <span class="material-symbols-outlined text-[18px]">check</span>
            <span>Deck Launched</span>
          `;
          setTimeout(() => {
            reviewBtn.innerHTML = originalText;
          }, 2000);
        }, 800);
      });
    }

    const dropzone = document.getElementById('upload-dropzone');
    if (dropzone) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('bg-primary-fixed/20');
      });
      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('bg-primary-fixed/20');
      });
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('bg-primary-fixed/20');
        alert('File detected! Auto-extraction simulation initiated.');
      });
    }
  })();
</script></main></div></body></html>

<!-- StudyTantra - Document Intelligence Workspace (Sahara Edition) -->
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;family=Manrope:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "surface-container": "#f2ece4", "on-tertiary-container": "#3a2020", "surface-bright": "#faf5ee", "primary": "#c2652a", "on-surface-variant": "#605850", "outline-variant": "#d8d0c8", "error": "#c0392b", "primary-fixed": "#fbe8d8", "surface-container-low": "#f6f0e8", "on-background": "#3a302a", "on-error": "#ffffff", "secondary-container": "#eae2da", "on-primary-container": "#fbe8d8", "on-secondary-container": "#605850", "on-secondary-fixed-variant": "#504840", "error-container": "#fce4e0", "secondary": "#78706a", "on-primary-fixed": "#401a08", "primary-container": "#e08850", "background": "#faf5ee", "on-secondary-fixed": "#2a2420", "on-surface": "#3a302a", "secondary-fixed": "#eae2da", "on-error-container": "#7a1a10", "primary-fixed-dim": "#f0a878", "surface": "#faf5ee", "inverse-primary": "#f0a878", "on-secondary": "#ffffff", "inverse-surface": "#3a302a", "tertiary-fixed-dim": "#e8a0a0", "tertiary-container": "#d47070", "inverse-on-surface": "#faf5ee", "outline": "#9a9088", "surface-container-high": "#ece6dc", "surface-dim": "#dcd6cc", "surface-container-lowest": "#ffffff", "tertiary": "#8c3c3c", "surface-variant": "#ece6dc", "on-primary": "#ffffff", "surface-container-highest": "#e6e0d6", "on-tertiary-fixed": "#2e1515", "surface-tint": "#c2652a", "on-tertiary-fixed-variant": "#6e3030", "on-tertiary": "#ffffff", "tertiary-fixed": "#fce0e0", "on-primary-fixed-variant": "#8a4518", "secondary-fixed-dim": "#cec6be" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": {}, "fontFamily": { "headline": [ "EB Garamond" ], "display": [ "EB Garamond" ], "body": [ "Manrope" ], "label": [ "Manrope" ] }, "fontSize": {} } } }</script></head><body class="bg-surface font-body text-on-surface antialiased"><aside class="fixed left-0 top-0 h-screen w-72 bg-surface-container-low shadow-[0_1px_8px_rgba(58,48,42,0.04)] z-50 flex flex-col justify-between py-6 px-5"><div class="flex flex-col"><div class="px-3 pb-6 flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm"><span class="material-symbols-outlined text-2xl">local_fire_department</span></div><div class="flex flex-col"><span class="font-headline text-2xl font-bold tracking-tight text-on-surface leading-none">StudyTantra</span><span class="text-[11px] font-label font-medium tracking-wide uppercase text-on-surface-variant mt-1">AI Spaced Recall</span></div></div><nav class="flex flex-col gap-1.5 mt-2" data-active-classes="bg-primary-container text-on-primary font-semibold shadow-sm"><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[20px]">grid_view</span><span>Dashboard</span></a><a aria-current="page" class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors bg-primary-container text-on-primary font-semibold shadow-sm" data-path="document-library" href="#"><span class="material-symbols-outlined text-[20px]">menu_book</span><span>Document Library</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="flashcards-vault" href="#"><span class="material-symbols-outlined text-[20px]">style</span><span>Flashcards Vault</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="spaced-review" href="#"><span class="material-symbols-outlined text-[20px]">neurology</span><span>Spaced Review</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="exam-planner" href="#"><span class="material-symbols-outlined text-[20px]">event_upcoming</span><span>Exam Planner</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="quiz-engine" href="#"><span class="material-symbols-outlined text-[20px]">bolt</span><span>Quiz Engine</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="settings" href="#"><span class="material-symbols-outlined text-[20px]">settings</span><span>Settings</span></a></nav></div><div class="flex flex-col gap-4 px-1"><div class="p-4 rounded-xl bg-surface-container flex items-center justify-between shadow-[0_2px_16px_rgba(58,48,42,0.04)]"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[22px]">flare</span></div><div class="flex flex-col"><span class="text-[11px] font-label font-medium uppercase text-on-surface-variant">Mindful Habit</span><span class="text-xs font-semibold text-on-surface">14 Days Streak</span></div></div><span class="text-xs font-bold text-primary font-label bg-surface px-2 py-1 rounded-md">Lv. 4</span></div><div class="flex items-center justify-between pt-2 border-t border-outline-variant/40"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div><div class="flex flex-col"><span class="text-xs font-semibold text-on-surface leading-snug">Arya Sharma</span><span class="text-[10px] text-on-surface-variant">Scholar Plan</span></div></div><button aria-label="Account switcher" class="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">unfold_more</span></button></div></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 z-40 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(58,48,42,0.04)]"><div class="h-16 w-full px-8 flex items-center justify-between gap-6"><div class="flex-1 max-w-xl"><div class="relative flex items-center"><span class="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">search</span><input class="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="Search concepts, textbooks, notes, formulas..." type="text"/></div></div><div class="flex items-center gap-3"><div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-xs text-on-surface"><span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span><span class="font-label font-medium text-[11px] text-on-surface-variant">Active Deck:</span><span class="font-semibold text-primary text-[11px]">Cognitive Neuroscience</span></div><button aria-label="Notifications" class="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary"></span></button><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="relative pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<!-- Dynamic Reader Workspace -->
<div class="px-8 py-7 w-full max-w-[1600px] mx-auto">
<!-- Top Utility & Metadata Strip -->
<div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-2">
<div class="flex items-center gap-2 text-xs font-label">
<span class="text-on-surface-variant font-medium">Curriculum</span>
<span class="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
<span class="text-on-surface-variant font-medium">CS-402 Database Systems</span>
<span class="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
<span class="text-primary font-semibold tracking-wide">Chapter 19.4: Validation-Based Concurrency</span>
</div>
<div class="flex items-center gap-3">
<div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant">
<span class="material-symbols-outlined text-[15px] text-primary" style="font-variation-settings: 'FILL' 1;">auto_stories</span>
<span class="font-medium">8 min read</span>
<span class="text-outline">·</span>
<span>1,420 words</span>
</div>
<div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-xs text-on-primary-fixed">
<span class="material-symbols-outlined text-[14px] text-primary">verified</span>
<span class="font-semibold text-[11px] tracking-wide">Silberschatz 7th Ed. p. 844</span>
</div>
<div class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high text-xs text-on-surface">
<span class="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
<span class="text-[11px] font-medium ml-1">Live Recall Active</span>
</div>
</div>
</div>
<!-- Dual-Pane Master Grid -->
<div class="grid grid-cols-1 lg:grid-cols-100 gap-8 items-start">
<!-- ================= LEFT READER COLUMN (62%) ================= -->
<article class="lg:col-span-62 flex flex-col gap-6">
<!-- Primary Textbook Editorial Sheet -->
<div class="bg-surface-container-lowest rounded-2xl p-8 sm:p-11 shadow-[0_2px_24px_rgba(58,48,42,0.04)] relative overflow-hidden">
<!-- Subtle warm decorative glow -->
<div class="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"></div>
<!-- Document Header Segment -->
<header class="mb-8 relative">
<div class="flex items-center justify-between text-xs text-on-surface-variant uppercase tracking-wider font-label mb-3">
<span class="font-bold text-primary flex items-center gap-1.5">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Part IV: Transaction Processing
              </span>
<span class="text-[11px] text-secondary">Updated 3h ago</span>
</div>
<h1 class="font-headline text-4xl sm:text-5xl font-bold text-on-surface tracking-tight leading-[1.12] mb-4">
              Validation-Based (Optimistic) Concurrency Control
            </h1>
<p class="font-body text-base text-on-surface-variant leading-relaxed max-w-2xl">
              Eliminating synchronization bottlenecks in workload topologies dominated by read assertions, speculative execution, and low transaction collision probabilities.
            </p>
</header>
<!-- Core Callout / TLDR Capsule -->
<div class="p-5 rounded-xl bg-surface-container-low mb-9 flex gap-4 items-start">
<div class="w-8 h-8 rounded-lg bg-primary-fixed flex-shrink-0 flex items-center justify-center text-primary mt-0.5">
<span class="material-symbols-outlined text-[20px]">lightbulb</span>
</div>
<div class="flex flex-col gap-1 text-xs">
<span class="font-semibold text-on-surface font-label uppercase tracking-wide text-[11px]">Core Operational Hypothesis</span>
<p class="text-on-surface-variant leading-relaxed text-[13px]">
                In optimistic concurrency control (OCC), transactions assume conflict is rare. Data operations execute without prior locks in private workspaces; serializability is verified retrospectively immediately before commit.
              </p>
</div>
</div>
<!-- Editorial Body Content -->
<div class="space-y-7 text-on-surface text-[15px] leading-relaxed font-body">
<section class="space-y-3">
<h2 class="font-headline text-2xl font-bold text-on-surface flex items-center gap-2">
<span>19.4.1 The Three-Phase Lifecycle</span>
</h2>
<p>
                Kung and Robinson formulate optimistic protocols through strict partitioning into non-overlapping temporal states. Rather than acquiring fine-grained latches or write intents during runtime, each transaction <span class="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded text-on-surface">T<sub>i</sub></span> navigates:
              </p>
<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
<div class="p-3.5 rounded-xl bg-surface-container-low">
<span class="text-[10px] font-bold uppercase tracking-wider text-primary font-label">Phase I</span>
<div class="font-headline text-lg font-bold text-on-surface mt-0.5">Read &amp; Execute</div>
<p class="text-xs text-on-surface-variant mt-1 leading-snug">Writes are buffered purely to local private shadow copies. No shared state is tainted.</p>
</div>
<div class="p-3.5 rounded-xl bg-surface-container">
<span class="text-[10px] font-bold uppercase tracking-wider text-tertiary font-label">Phase II</span>
<div class="font-headline text-lg font-bold text-on-surface mt-0.5">Validation</div>
<p class="text-xs text-on-surface-variant mt-1 leading-snug">Critical section checking if transaction execution violated conflict serializability.</p>
</div>
<div class="p-3.5 rounded-xl bg-surface-container-low">
<span class="text-[10px] font-bold uppercase tracking-wider text-secondary font-label">Phase III</span>
<div class="font-headline text-lg font-bold text-on-surface mt-0.5">Write Propagation</div>
<p class="text-xs text-on-surface-variant mt-1 leading-snug">If validation succeeds, local buffers flush to disk/shared RAM. Otherwise, abort &amp; roll back.</p>
</div>
</div>
</section>
<!-- Monospaced Validation Formula Box -->
<div class="rounded-xl bg-surface-container p-6 relative overflow-hidden my-6">
<div class="flex items-center justify-between mb-3 text-xs text-on-surface-variant font-label">
<span class="font-semibold tracking-wider uppercase text-[11px] text-primary">Formal BOCC Verification Theorem</span>
<span class="font-mono text-[11px] text-secondary">Silberschatz §19.4 Eq. 3</span>
</div>
<div class="font-mono text-xs sm:text-[13px] text-on-surface bg-surface-container-lowest p-4 rounded-lg leading-relaxed shadow-sm overflow-x-auto">
<span class="text-primary font-semibold">∀ T_k ∈ Active(T_i):</span><br/>
                  1. Finish(T_k) &lt; Start(T_i)<br/>
                  2. StartWrite(T_i) &gt; Finish(T_k) <span class="text-secondary">∧</span> (WriteSet(T_k) ∩ ReadSet(T_i) = ∅)<br/>
                  3. WriteSet(T_k) ∩ (ReadSet(T_i) ∪ WriteSet(T_i)) = ∅
              </div>
<p class="text-xs text-on-surface-variant mt-3">
                Condition (2) asserts that <span class="font-mono text-[11px]">T_k</span> does not overwrite any tuples read by <span class="font-mono text-[11px]">T_i</span> prior to <span class="font-mono text-[11px]">T_i</span> completing its computation stage.
              </p>
</div>
<!-- Visual Diagram / Lecture Artifact -->
<div class="rounded-2xl bg-surface-container-low p-5 my-6">
<div class="flex items-center justify-between mb-3">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[20px]">schema</span>
<span class="font-headline text-base font-bold text-on-surface">Fig 19.8: Private Buffer Shadow Lifecycle &amp; Validation Boundary</span>
</div>
<span class="text-[11px] text-on-surface-variant font-label font-medium bg-surface px-2 py-0.5 rounded">Lecture Archive Slide #42</span>
</div>
<!-- Inline Diagram Visualizer -->
<div class="bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-3">
<div class="w-full flex items-center justify-between text-[11px] font-mono text-secondary px-2">
<span>Start (T_i)</span>
<span>Validation Start (TS_v)</span>
<span>Commit / Flush</span>
</div>
<!-- SVG Timeline Graphic -->
<svg class="w-full h-auto text-primary" fill="none" viewbox="0 0 640 130" xmlns="http://www.w3.org/2000/svg">
<!-- Timeline axis -->
<line stroke="currentColor" stroke-dasharray="4 4" stroke-opacity="0.2" stroke-width="2" x1="20" x2="620" y1="65" y2="65"></line>
<!-- Phase 1: Local Workspace -->
<rect fill="#fbe8d8" fill-opacity="0.8" height="48" rx="6" width="220" x="30" y="35"></rect>
<text fill="#401a08" font-family="Manrope" font-size="11" font-weight="600" text-anchor="middle" x="140" y="58">Read Phase</text>
<text fill="#8a4518" font-family="Manrope" font-size="9" text-anchor="middle" x="140" y="73">Private Shadow RAM</text>
<!-- Phase 2: Validation Marker -->
<rect fill="#e08850" height="68" rx="8" width="160" x="270" y="25"></rect>
<text fill="#ffffff" font-family="Manrope" font-size="12" font-weight="700" text-anchor="middle" x="350" y="56">Validation Check</text>
<text fill="#fbe8d8" font-family="Manrope" font-size="10" text-anchor="middle" x="350" y="74">Critical Section (FOCC/BOCC)</text>
<!-- Arrow flow -->
<path d="M 445 65 L 465 65" marker-end="url(#arrow)" stroke="#c2652a" stroke-width="2"></path>
<!-- Phase 3: Write Phase -->
<rect fill="#fbe8d8" fill-opacity="0.8" height="48" rx="6" width="130" x="480" y="35"></rect>
<text fill="#401a08" font-family="Manrope" font-size="11" font-weight="600" text-anchor="middle" x="545" y="58">Write Phase</text>
<text fill="#8a4518" font-family="Manrope" font-size="9" text-anchor="middle" x="545" y="73">Shared DB Log Sync</text>
<!-- Time ticks -->
<circle cx="30" cy="65" fill="#c2652a" r="4"></circle>
<circle cx="270" cy="65" fill="#c2652a" r="5"></circle>
<circle cx="610" cy="65" fill="#c2652a" r="4"></circle>
</svg>
<div class="flex items-center justify-between text-xs text-on-surface-variant pt-2">
<div class="flex items-center gap-1.5">
<span class="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
<span class="text-[11px]">Conflict detection operates only on read/write timestamps</span>
</div>
<span class="text-[11px] font-mono text-tertiary font-semibold">Abort Rate: ~1.2% in Read-Heavy Benchmarks</span>
</div>
</div>
</div>
<!-- Comparative Analysis Table -->
<section class="space-y-3 pt-3">
<h2 class="font-headline text-2xl font-bold text-on-surface">
                19.4.2 Comparative Analysis: OCC vs. 2-Phase Locking (2PL)
              </h2>
<p>
                Strict two-phase locking guarantees conflict serializability at the expense of high coordination latency and cascading abort risks. The table below delineates trade-offs in distributed data engines:
              </p>
<div class="overflow-x-auto rounded-xl bg-surface-container mt-4">
<table class="w-full text-left text-xs border-collapse">
<thead>
<tr class="bg-surface-container-high text-on-surface font-label font-bold text-[11px] uppercase tracking-wider">
<th class="p-3.5">Metric Dimension</th>
<th class="p-3.5 text-primary">Optimistic Concurrency (OCC)</th>
<th class="p-3.5 text-secondary">Two-Phase Locking (Rigorous 2PL)</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container-high text-on-surface">
<tr class="hover:bg-surface-container-lowest/50 transition-colors">
<td class="p-3.5 font-semibold text-on-surface">Locking Overhead</td>
<td class="p-3.5 font-medium text-primary">Zero runtime lock management; zero lock-table thrashing.</td>
<td class="p-3.5 text-on-surface-variant">Continuous lock acquisition &amp; conversion overhead on read/write sets.</td>
</tr>
<tr class="hover:bg-surface-container-lowest/50 transition-colors">
<td class="p-3.5 font-semibold text-on-surface">Deadlock Hazards</td>
<td class="p-3.5 font-medium text-primary">Deadlock-free by design (validation order is monotonic).</td>
<td class="p-3.5 text-on-surface-variant">Prone to cyclic wait-for dependencies; requires timeout/kill graph.</td>
</tr>
<tr class="hover:bg-surface-container-lowest/50 transition-colors">
<td class="p-3.5 font-semibold text-on-surface">System Bottlenecks</td>
<td class="p-3.5 font-medium text-primary">High abort rates during write hotspots; wasted speculative compute.</td>
<td class="p-3.5 text-on-surface-variant">Long locks block concurrent readers; convoy effects on popular rows.</td>
</tr>
</tbody>
</table>
</div>
</section>
</div>
<!-- Reader Embedded Action Bar -->
<footer class="mt-10 pt-6 flex flex-wrap items-center justify-between gap-4">
<div class="flex items-center gap-2">
<button class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-all" type="button">
<span class="material-symbols-outlined text-[17px] text-primary">border_color</span>
<span>Highlight Passage</span>
</button>
<button class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-all" type="button">
<span class="material-symbols-outlined text-[17px] text-secondary">add_comment</span>
<span>Add Margin Note</span>
</button>
<button class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold shadow-sm transition-all" type="button">
<span class="material-symbols-outlined text-[17px]">bolt</span>
<span>Synthesize Flashcards</span>
</button>
</div>
<div class="flex items-center gap-3">
<span class="text-xs font-label text-on-surface-variant">Cards in Deck:</span>
<span class="px-2.5 py-1 rounded-full bg-primary-fixed text-primary font-bold text-xs font-label">24 Ready</span>
</div>
</footer>
</div>
<!-- Instructor Lecture Reference Audio / Note Card -->
<div class="p-6 rounded-2xl bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm flex-shrink-0">
<span class="material-symbols-outlined text-2xl">graphic_eq</span>
</div>
<div>
<div class="text-xs font-bold uppercase tracking-wider text-primary font-label">Prof. H. Stone · Stanford CS402</div>
<div class="font-headline text-lg font-bold text-on-surface">OCC in Modern Multi-Core In-Memory Engines (Silo &amp; Hekaton)</div>
<div class="text-xs text-on-surface-variant">Timestamp: 34:12 - 42:50 · 8 min clip attached to notes</div>
</div>
</div>
<button class="px-4 py-2 rounded-lg bg-surface-container-lowest text-xs font-bold text-on-surface hover:text-primary transition-colors flex items-center gap-2" type="button">
<span class="material-symbols-outlined text-[18px]">play_circle</span>
<span>Listen (1.5x)</span>
</button>
</div>
</article>
<!-- ================= RIGHT AI COPILOT COLUMN (38%) ================= -->
<aside class="lg:col-span-38 flex flex-col gap-6">
<!-- Live AI Copilot Status Card -->
<div class="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_20px_rgba(58,48,42,0.04)] relative">
<div class="flex items-center justify-between mb-4 pb-3">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
<span class="material-symbols-outlined text-[19px]">neurology</span>
</div>
<div>
<h3 class="font-headline text-lg font-bold text-on-surface leading-none">Tantra AI Copilot</h3>
<span class="text-[10px] font-label font-medium text-primary uppercase tracking-wider">Claude-3.5 Sonnet · Active Stream</span>
</div>
</div>
<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container text-on-surface-variant">Passage Focus</span>
</div>
<div class="p-3.5 rounded-xl bg-surface-container-low text-xs leading-relaxed text-on-surface mb-4">
<p class="font-medium text-[12px] text-primary mb-1 flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">psychology_alt</span>
              Synthesizing Cognitive Model
            </p>
<p class="text-on-surface-variant text-[12px]">
              Analyzing paragraph 4 for semantic ambiguities. Found 1 high-frequency exam pattern regarding <span class="font-semibold text-on-surface">Backward vs Forward Validation</span> trade-offs.
            </p>
</div>
<!-- Instant Generated Flashcard Widget -->
<div class="rounded-xl bg-surface-container p-4">
<div class="flex items-center justify-between mb-2">
<span class="text-[10px] font-bold uppercase tracking-wider text-primary font-label flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">style</span>
                Instant Synthesized Flashcard
              </span>
<span class="text-[10px] text-secondary font-mono">ID: #FC-1941</span>
</div>
<!-- Card Front / Preview -->
<div class="bg-surface-container-lowest rounded-lg p-3.5 shadow-sm mb-3">
<div class="text-[10px] uppercase font-bold text-on-surface-variant font-label mb-1">Prompt / Question</div>
<p class="text-xs font-semibold text-on-surface font-body leading-snug">
                What are the 3 mandatory conditions checked during Backward Validation (BOCC) before commit authorization?
              </p>
</div>
<div class="flex items-center gap-2">
<button class="flex-1 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm" type="button">
<span class="material-symbols-outlined text-[16px]">add_circle</span>
<span>Add to Vault</span>
</button>
<button class="px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface transition-colors" type="button">
                Review Later
              </button>
</div>
</div>
</div>
<!-- Diagnostic Quick-Check Widget -->
<div class="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_20px_rgba(58,48,42,0.04)]">
<div class="flex items-center justify-between mb-3">
<div class="flex items-center gap-2">
<span class="w-6 h-6 rounded-md bg-primary-fixed flex items-center justify-center text-primary text-xs font-bold font-label">?</span>
<h4 class="font-headline text-lg font-bold text-on-surface">Diagnostic Quick-Check</h4>
</div>
<span class="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-bold text-[10px] font-label">+100 XP</span>
</div>
<p class="text-xs text-on-surface-variant mb-4">
            Under high-write contention, why does Optimistic Concurrency degrade faster than strict 2PL?
          </p>
<form class="space-y-2.5 text-xs font-body" onsubmit="event.preventDefault(); document.getElementById('quiz-feedback').classList.remove('hidden');">
<label class="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
<input class="mt-0.5 accent-primary" name="quick_quiz" type="radio"/>
<span class="text-on-surface leading-tight">OCC causes distributed deadlock graphs that freeze OS processes.</span>
</label>
<label class="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
<input class="mt-0.5 accent-primary" name="quick_quiz" type="radio"/>
<span class="text-on-surface leading-tight">Transactions repeatedly execute full read/compute phases only to be aborted in validation, causing severe compute wastage.</span>
</label>
<label class="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
<input class="mt-0.5 accent-primary" name="quick_quiz" type="radio"/>
<span class="text-on-surface leading-tight">OCC requires persistent disk locks during the read phase.</span>
</label>
<button class="w-full mt-3 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2" type="submit">
<span class="material-symbols-outlined text-[17px]">task_alt</span>
<span>Verify Concept</span>
</button>
</form>
<div class="hidden mt-3 p-3 rounded-lg bg-emerald-50 text-emerald-900 text-xs flex items-start gap-2" id="quiz-feedback">
<span class="material-symbols-outlined text-emerald-700 text-[18px]">check_circle</span>
<span><strong>Correct!</strong> In write-intensive workloads, speculative work is continually discarded, triggering catastrophic throughput collapse (the "livelock ripple").</span>
</div>
</div>
<!-- Key Extracted Axioms -->
<div class="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_20px_rgba(58,48,42,0.04)]">
<div class="flex items-center justify-between mb-4">
<h4 class="font-headline text-lg font-bold text-on-surface">Extracted Axioms</h4>
<span class="text-[11px] font-label text-primary font-semibold">3 Synthesized</span>
</div>
<div class="space-y-3">
<div class="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
<div class="flex items-center justify-between text-[10px] text-secondary font-label mb-1">
<span class="font-bold text-primary">Axiom 19.4a</span>
<span>p. 845 ¶ 2</span>
</div>
<p class="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                Timestamps are assigned at Validation Start, not transaction instantiation.
              </p>
</div>
<div class="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
<div class="flex items-center justify-between text-[10px] text-secondary font-label mb-1">
<span class="font-bold text-primary">Axiom 19.4b</span>
<span>p. 846 ¶ 4</span>
</div>
<p class="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                Forward Validation (FOCC) aborts conflicting active transactions, not the validating one.
              </p>
</div>
<div class="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
<div class="flex items-center justify-between text-[10px] text-secondary font-label mb-1">
<span class="font-bold text-primary">Axiom 19.4c</span>
<span>p. 848 ¶ 1</span>
</div>
<p class="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                In-memory OCC outperforms 2PL up to 80% read skew across multi-socket NUMA boards.
              </p>
</div>
</div>
</div>
<!-- Synaptic Knowledge Graph Links -->
<div class="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_20px_rgba(58,48,42,0.04)]">
<div class="flex items-center justify-between mb-3">
<h4 class="font-headline text-lg font-bold text-on-surface">Synaptic Graph Links</h4>
<span class="material-symbols-outlined text-outline text-[18px]">hub</span>
</div>
<p class="text-xs text-on-surface-variant mb-3">
            Prerequisites and downstream modules connected to this section:
          </p>
<div class="flex flex-wrap gap-2">
<a class="px-2.5 py-1.5 rounded-lg bg-surface-container text-xs text-on-surface hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1.5" href="#">
<span class="material-symbols-outlined text-[14px]">arrow_back</span>
<span>18.2 Conflict Serializability</span>
</a>
<a class="px-2.5 py-1.5 rounded-lg bg-surface-container text-xs text-on-surface hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1.5" href="#">
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
<span>19.5 Multi-Version OCC (MVCC)</span>
</a>
<a class="px-2.5 py-1.5 rounded-lg bg-surface-container text-xs text-on-surface hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1.5" href="#">
<span class="material-symbols-outlined text-[14px]">terminal</span>
<span>Postgres SSI Implementation</span>
</a>
<a class="px-2.5 py-1.5 rounded-lg bg-surface-container text-xs text-on-surface hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1.5" href="#">
<span class="material-symbols-outlined text-[14px]">network_node</span>
<span>Google Spanner TrueTime OCC</span>
</a>
</div>
</div>
</aside>
</div>
</div>
</div></main></div></body></html>

<!-- StudyTantra - Interactive Quiz Engine (Sahara Edition) -->
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;family=Manrope:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "surface-container": "#f2ece4", "on-tertiary-container": "#3a2020", "surface-bright": "#faf5ee", "primary": "#c2652a", "on-surface-variant": "#605850", "outline-variant": "#d8d0c8", "error": "#c0392b", "primary-fixed": "#fbe8d8", "surface-container-low": "#f6f0e8", "on-background": "#3a302a", "on-error": "#ffffff", "secondary-container": "#eae2da", "on-primary-container": "#fbe8d8", "on-secondary-container": "#605850", "on-secondary-fixed-variant": "#504840", "error-container": "#fce4e0", "secondary": "#78706a", "on-primary-fixed": "#401a08", "primary-container": "#e08850", "background": "#faf5ee", "on-secondary-fixed": "#2a2420", "on-surface": "#3a302a", "secondary-fixed": "#eae2da", "on-error-container": "#7a1a10", "primary-fixed-dim": "#f0a878", "surface": "#faf5ee", "inverse-primary": "#f0a878", "on-secondary": "#ffffff", "inverse-surface": "#3a302a", "tertiary-fixed-dim": "#e8a0a0", "tertiary-container": "#d47070", "inverse-on-surface": "#faf5ee", "outline": "#9a9088", "surface-container-high": "#ece6dc", "surface-dim": "#dcd6cc", "surface-container-lowest": "#ffffff", "tertiary": "#8c3c3c", "surface-variant": "#ece6dc", "on-primary": "#ffffff", "surface-container-highest": "#e6e0d6", "on-tertiary-fixed": "#2e1515", "surface-tint": "#c2652a", "on-tertiary-fixed-variant": "#6e3030", "on-tertiary": "#ffffff", "tertiary-fixed": "#fce0e0", "on-primary-fixed-variant": "#8a4518", "secondary-fixed-dim": "#cec6be" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": {}, "fontFamily": { "headline": [ "EB Garamond" ], "display": [ "EB Garamond" ], "body": [ "Manrope" ], "label": [ "Manrope" ] }, "fontSize": {} } } }</script></head><body class="bg-surface font-body text-on-surface antialiased"><aside class="fixed left-0 top-0 h-screen w-72 bg-surface-container-low shadow-[0_1px_8px_rgba(58,48,42,0.04)] z-50 flex flex-col justify-between py-6 px-5"><div class="flex flex-col"><div class="px-3 pb-6 flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm"><span class="material-symbols-outlined text-2xl">local_fire_department</span></div><div class="flex flex-col"><span class="font-headline text-2xl font-bold tracking-tight text-on-surface leading-none">StudyTantra</span><span class="text-[11px] font-label font-medium tracking-wide uppercase text-on-surface-variant mt-1">AI Spaced Recall</span></div></div><nav class="flex flex-col gap-1.5 mt-2" data-active-classes="bg-primary-container text-on-primary font-semibold shadow-sm"><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[20px]">grid_view</span><span>Dashboard</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="document-library" href="#"><span class="material-symbols-outlined text-[20px]">menu_book</span><span>Document Library</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="flashcards-vault" href="#"><span class="material-symbols-outlined text-[20px]">style</span><span>Flashcards Vault</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="spaced-review" href="#"><span class="material-symbols-outlined text-[20px]">neurology</span><span>Spaced Review</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="exam-planner" href="#"><span class="material-symbols-outlined text-[20px]">event_upcoming</span><span>Exam Planner</span></a><a aria-current="page" class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors bg-primary-container text-on-primary font-semibold shadow-sm" data-path="quiz-engine" href="#"><span class="material-symbols-outlined text-[20px]">bolt</span><span>Quiz Engine</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="settings" href="#"><span class="material-symbols-outlined text-[20px]">settings</span><span>Settings</span></a></nav></div><div class="flex flex-col gap-4 px-1"><div class="p-4 rounded-xl bg-surface-container flex items-center justify-between shadow-[0_2px_16px_rgba(58,48,42,0.04)]"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[22px]">flare</span></div><div class="flex flex-col"><span class="text-[11px] font-label font-medium uppercase text-on-surface-variant">Mindful Habit</span><span class="text-xs font-semibold text-on-surface">14 Days Streak</span></div></div><span class="text-xs font-bold text-primary font-label bg-surface px-2 py-1 rounded-md">Lv. 4</span></div><div class="flex items-center justify-between pt-2 border-t border-outline-variant/40"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div><div class="flex flex-col"><span class="text-xs font-semibold text-on-surface leading-snug">Arya Sharma</span><span class="text-[10px] text-on-surface-variant">Scholar Plan</span></div></div><button aria-label="Account switcher" class="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">unfold_more</span></button></div></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 z-40 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(58,48,42,0.04)]"><div class="h-16 w-full px-8 flex items-center justify-between gap-6"><div class="flex-1 max-w-xl"><div class="relative flex items-center"><span class="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">search</span><input class="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="Search concepts, textbooks, notes, formulas..." type="text"/></div></div><div class="flex items-center gap-3"><div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-xs text-on-surface"><span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span><span class="font-label font-medium text-[11px] text-on-surface-variant">Active Deck:</span><span class="font-semibold text-primary text-[11px]">Cognitive Neuroscience</span></div><button aria-label="Notifications" class="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary"></span></button><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="relative pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<!-- Interactive Top Assessment Bar -->
<div class="px-8 py-5 bg-surface-container-low/80 backdrop-blur-md sticky top-16 z-30 shadow-[0_4px_20px_rgba(58,48,42,0.03)]">
<div class="max-w-7xl mx-auto flex flex-col gap-4">
<div class="flex flex-wrap items-center justify-between gap-4">
<!-- Quiz Meta Title -->
<div class="flex items-center gap-3">
<span class="p-2 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">terminal</span>
</span>
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="text-[10px] font-label font-bold uppercase tracking-widest text-primary">Live Assessment</span>
<span class="text-xs text-outline font-medium">•</span>
<span class="text-xs font-label text-on-surface-variant">Database Systems Specialization</span>
</div>
<h1 class="font-headline text-xl md:text-2xl font-bold text-on-surface tracking-tight leading-snug">
              CS-402 Concurrency Control &amp; Recovery Mastery Exam
            </h1>
</div>
</div>
<!-- Telemetry Pill Indicators -->
<div class="flex items-center gap-3 flex-wrap">
<!-- Countdown Clock -->
<div class="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-surface-container-lowest shadow-sm">
<span class="material-symbols-outlined text-primary text-[18px] animate-spin" style="animation-duration: 9s;">timer</span>
<div class="flex flex-col">
<span class="text-[10px] uppercase font-label font-semibold text-on-surface-variant leading-none">Remaining</span>
<span class="text-sm font-semibold font-label text-on-surface tracking-tight" id="quiz-countdown">24:15</span>
</div>
</div>
<!-- Question Progress Counter -->
<div class="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-surface-container-lowest shadow-sm">
<span class="material-symbols-outlined text-tertiary text-[18px]">rule</span>
<div class="flex flex-col">
<span class="text-[10px] uppercase font-label font-semibold text-on-surface-variant leading-none">Pacing</span>
<span class="text-sm font-semibold font-label text-on-surface">Question 7 <span class="text-on-surface-variant/70 font-normal">of 20</span></span>
</div>
</div>
<!-- XP Bounty Pill -->
<div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-on-primary shadow-sm">
<span class="material-symbols-outlined text-[18px]">bolt</span>
<span class="text-xs font-bold font-label tracking-wide">+250 Mastery XP</span>
</div>
</div>
</div>
<!-- Segmented Terracotta Progress Track -->
<div class="flex items-center gap-1.5 w-full pt-1">
<div class="h-2 flex-1 rounded-full bg-primary transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-primary transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-primary transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-primary transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-primary transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-primary transition-all"></div>
<!-- Active 7th segment with pulse halo -->
<div class="h-2 flex-1 rounded-full bg-primary relative">
<span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary/30 animate-ping"></span>
</div>
<div class="h-2 flex-1 rounded-full bg-surface-container-high transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-surface-container-high transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-surface-container-high transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-surface-container-high transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-surface-container-high transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-surface-container-high transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-surface-container-high transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-surface-container-high transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-surface-container-high transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-surface-container-high transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-surface-container-high transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-surface-container-high transition-all"></div>
<div class="h-2 flex-1 rounded-full bg-surface-container-high transition-all"></div>
</div>
</div>
</div>
<!-- Main Question Arena & Diagnostic Workspace -->
<div class="px-8 py-8 max-w-7xl mx-auto w-full">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
<!-- Primary Question Canvas (8 cols) -->
<section class="lg:col-span-8 flex flex-col gap-6">
<!-- Question Narrative Card -->
<div class="bg-surface-container-lowest rounded-2xl p-7 md:p-9 shadow-[0_2px_16px_rgba(58,48,42,0.04)] relative overflow-hidden">
<div class="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary/5 pointer-events-none blur-2xl"></div>
<div class="flex items-center justify-between pb-4">
<div class="flex items-center gap-2.5">
<span class="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label text-xs font-semibold uppercase tracking-wider">
                Module 4 • Protocol Validation
              </span>
<span class="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-medium font-label">
                Hard Complexity
              </span>
</div>
<div class="flex items-center gap-2">
<button class="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors" title="Bookmark concept" type="button">
<span class="material-symbols-outlined text-[20px]">bookmark_border</span>
</button>
<button class="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors" title="Report typo or error" type="button">
<span class="material-symbols-outlined text-[20px]">flag_circle</span>
</button>
</div>
</div>
<!-- Editorial Headline Question -->
<div class="space-y-4">
<span class="text-xs font-label font-bold tracking-widest uppercase text-primary">Problem Statement</span>
<p class="font-headline text-2xl md:text-3xl text-on-surface leading-tight font-medium">
              Suppose transaction <span class="italic font-semibold text-primary">T₁</span> reads data item <span class="italic font-bold">X</span> and writes <span class="italic font-bold">Y</span>, while <span class="italic font-semibold text-primary">T₂</span> reads <span class="italic font-bold">Y</span> and writes <span class="italic font-bold">X</span>. Under Forward Optimistic Concurrency Control (FOCC), when <span class="italic font-semibold text-primary">T₁</span> reaches its validation phase prior to <span class="italic font-semibold text-primary">T₂</span> committing, which condition triggers a conflict abort?
            </p>
</div>
<!-- Visual Transaction Schedule Diagram Snippet -->
<div class="mt-6 rounded-xl bg-surface-container-low p-5 shadow-inner">
<div class="flex items-center justify-between pb-3">
<span class="text-[11px] font-label uppercase font-bold tracking-wider text-on-surface-variant flex items-center gap-2">
<span class="material-symbols-outlined text-[16px] text-primary">code_blocks</span>
                Serial Interleaving Schedule Representation
              </span>
<span class="text-[11px] font-label text-on-surface-variant/80">FOCC Engine v3.1</span>
</div>
<!-- Monospace Execution Trace Matrix -->
<div class="font-mono text-xs md:text-sm bg-surface-container-lowest/80 rounded-lg p-4 overflow-x-auto text-on-surface leading-relaxed shadow-sm">
<div class="grid grid-cols-12 gap-2 text-on-surface-variant pb-2 font-bold uppercase text-[10px] tracking-wider">
<span class="col-span-2">Phase</span>
<span class="col-span-5">T₁ (Validating)</span>
<span class="col-span-5">T₂ (Active Parallel)</span>
</div>
<div class="grid grid-cols-12 gap-2 py-1 items-center">
<span class="col-span-2 text-on-surface-variant/70 text-[11px]">t0: Read</span>
<span class="col-span-5 text-primary font-medium">R₁(X) → WS(T₁) = { Y }</span>
<span class="col-span-5 text-secondary">R₂(Y)</span>
</div>
<div class="grid grid-cols-12 gap-2 py-1 items-center bg-surface-container-low/60 rounded px-1 -mx-1">
<span class="col-span-2 text-on-surface-variant/70 text-[11px]">t1: Compute</span>
<span class="col-span-5 text-on-surface">Local buffer computation</span>
<span class="col-span-5 text-secondary">W₂(X) [buffered locally]</span>
</div>
<div class="grid grid-cols-12 gap-2 py-1 items-center">
<span class="col-span-2 text-primary font-semibold text-[11px]">t2: Validation</span>
<span class="col-span-5 text-primary font-bold">Validate(T₁) vs Active set</span>
<span class="col-span-5 text-tertiary italic">Parallel: RS(T₂) = { Y }</span>
</div>
</div>
</div>
</div>
<!-- Interactive Multiple Choice Grid -->
<div class="flex flex-col gap-3.5" id="answers-container">
<!-- Choice A (Active / Selected state in Terracotta styling) -->
<div class="choice-card cursor-pointer group rounded-xl p-5 bg-surface-container-lowest shadow-[0_2px_16px_rgba(58,48,42,0.06)] ring-2 ring-primary transition-all duration-150 transform hover:-translate-y-0.5" onclick="selectChoice(this)">
<div class="flex items-start gap-4">
<div class="mt-0.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0 shadow-sm">
<span class="material-symbols-outlined text-[16px]">check</span>
</div>
<div class="flex-1">
<div class="flex items-center justify-between pb-1">
<span class="text-xs font-label font-bold text-primary uppercase tracking-wider">Option A (Selected)</span>
<span class="text-[11px] font-label text-on-surface-variant">Selected by 64% students</span>
</div>
<p class="text-sm md:text-base font-semibold text-on-surface leading-snug">
                  If the Write Set of <span class="font-bold text-primary">T₁</span> intersects with the Read Set of parallel active transaction <span class="font-bold text-primary">T₂</span> (<span class="font-mono text-xs bg-surface-container-high px-1.5 py-0.5 rounded">WS(T₁) ∩ RS(T₂) ≠ ∅</span>), an unresolvable dirty read conflict exists; <span class="font-bold">T₁</span> (or alternatively <span class="font-bold">T₂</span>) must abort.
                </p>
</div>
</div>
</div>
<!-- Choice B -->
<div class="choice-card cursor-pointer group rounded-xl p-5 bg-surface-container-lowest hover:bg-surface-container-low shadow-[0_2px_16px_rgba(58,48,42,0.02)] transition-all duration-150 transform hover:-translate-y-0.5" onclick="selectChoice(this)">
<div class="flex items-start gap-4">
<div class="mt-0.5 w-6 h-6 rounded-full bg-surface-container-high group-hover:bg-primary/20 flex items-center justify-center text-on-surface-variant group-hover:text-primary flex-shrink-0 transition-colors">
<span class="text-xs font-bold font-label">B</span>
</div>
<div class="flex-1">
<div class="flex items-center justify-between pb-1">
<span class="text-xs font-label font-medium text-on-surface-variant uppercase tracking-wider">Option B</span>
</div>
<p class="text-sm md:text-base text-on-surface leading-snug">
                  Validation fails solely if <span class="font-mono text-xs bg-surface-container-high px-1.5 py-0.5 rounded">RS(T₁) ∩ WS(T₂) ≠ ∅</span>, because backward validation protocols explicitly govern the read-safety of the committing transaction against uncommitted writes.
                </p>
</div>
</div>
</div>
<!-- Choice C -->
<div class="choice-card cursor-pointer group rounded-xl p-5 bg-surface-container-lowest hover:bg-surface-container-low shadow-[0_2px_16px_rgba(58,48,42,0.02)] transition-all duration-150 transform hover:-translate-y-0.5" onclick="selectChoice(this)">
<div class="flex items-start gap-4">
<div class="mt-0.5 w-6 h-6 rounded-full bg-surface-container-high group-hover:bg-primary/20 flex items-center justify-center text-on-surface-variant group-hover:text-primary flex-shrink-0 transition-colors">
<span class="text-xs font-bold font-label">C</span>
</div>
<div class="flex-1">
<div class="flex items-center justify-between pb-1">
<span class="text-xs font-label font-medium text-on-surface-variant uppercase tracking-wider">Option C</span>
</div>
<p class="text-sm md:text-base text-on-surface leading-snug">
                  Neither transaction aborts under FOCC because writes are always committed to shadow copies first, postponing all intersection verifications until the multi-version timestamp barrier is lifted.
                </p>
</div>
</div>
</div>
<!-- Choice D -->
<div class="choice-card cursor-pointer group rounded-xl p-5 bg-surface-container-lowest hover:bg-surface-container-low shadow-[0_2px_16px_rgba(58,48,42,0.02)] transition-all duration-150 transform hover:-translate-y-0.5" onclick="selectChoice(this)">
<div class="flex items-start gap-4">
<div class="mt-0.5 w-6 h-6 rounded-full bg-surface-container-high group-hover:bg-primary/20 flex items-center justify-center text-on-surface-variant group-hover:text-primary flex-shrink-0 transition-colors">
<span class="text-xs font-bold font-label">D</span>
</div>
<div class="flex-1">
<div class="flex items-center justify-between pb-1">
<span class="text-xs font-label font-medium text-on-surface-variant uppercase tracking-wider">Option D</span>
</div>
<p class="text-sm md:text-base text-on-surface leading-snug">
                  Both <span class="font-bold">T₁</span> and <span class="font-bold">T₂</span> are instantly converted into Two-Phase Locking (2PL) conservative queues to resolve blind write deadlocks dynamically.
                </p>
</div>
</div>
</div>
</div>
<!-- Detailed Explanation / Answer Rationale Drawer Toggle -->
<div class="rounded-2xl bg-surface-container-lowest shadow-[0_2px_16px_rgba(58,48,42,0.04)] overflow-hidden">
<button class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface-container-low/40 transition-colors" id="toggle-explanation-btn" onclick="toggleExplanation()">
<div class="flex items-center gap-3">
<span class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">psychology_alt</span>
</span>
<div>
<span class="text-xs font-label font-bold uppercase tracking-wider text-primary">StudyTantra Analytical Engine</span>
<p class="text-sm font-semibold text-on-surface">Review Formal Rationale &amp; Textbook Proof</p>
</div>
</div>
<div class="flex items-center gap-2 text-xs font-semibold font-label text-on-surface-variant">
<span id="explanation-state-text">Expand Rationale</span>
<span class="material-symbols-outlined text-[18px] transition-transform duration-200" id="explanation-chevron">expand_more</span>
</div>
</button>
<!-- Drawer Content -->
<div class="hidden px-7 pb-7 pt-2 border-none" id="explanation-body">
<div class="p-5 rounded-xl bg-surface-container-low/70 space-y-4">
<div class="flex items-center gap-2 text-xs font-label font-bold uppercase tracking-wider text-tertiary">
<span class="material-symbols-outlined text-[16px]">verified</span>
                Mathematical Proof &amp; Serializability Invariant
              </div>
<p class="text-xs md:text-sm text-on-surface-variant leading-relaxed font-body">
                In Forward Optimistic Concurrency Control (FOCC), validation is conducted against all currently active concurrent transactions <span class="font-mono text-xs text-on-surface font-semibold">{Tⱼ}</span>. Specifically, for validating transaction <span class="font-mono text-xs text-on-surface font-semibold">Tᵥ</span>:
              </p>
<!-- Math formula block -->
<div class="py-3 px-4 rounded-lg bg-surface-container-lowest font-mono text-xs text-primary flex items-center justify-center gap-3 shadow-inner">
<span class="font-bold">Invariant:</span>
<span>WS(T_v) ∩ RS(T_active) = ∅</span>
</div>
<p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Here, <span class="font-mono text-xs bg-surface-container px-1 rounded">WS(T₁) = {Y}</span> and <span class="font-mono text-xs bg-surface-container px-1 rounded">RS(T₂) = {Y}</span>. Because <span class="italic">Y ∈ {Y}</span>, their intersection is non-empty. T₁'s imminent write would invalidate the read already committed to by T₂'s execution phase. FOCC remedies this by either aborting the validating transaction or canceling conflicting parallel threads.
              </p>
<div class="pt-3 flex flex-wrap items-center justify-between text-[11px] text-on-surface-variant font-label border-none">
<span class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-primary">auto_stories</span>
<span>Silberschatz, Korth, Sudarshan — <em>Database System Concepts (7th Ed.)</em>, Chap. 18.5</span>
</span>
<span class="text-primary font-semibold">Spaced Retention Weight: 98.4%</span>
</div>
</div>
</div>
</div>
</section>
<!-- Diagnostic Sidebar & Question Matrix (4 cols) -->
<aside class="lg:col-span-4 flex flex-col gap-6">
<!-- Question Matrix Grid Card -->
<div class="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
<div class="flex items-center justify-between pb-4">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[20px]">dialpad</span>
<h2 class="text-sm font-label font-bold uppercase tracking-wider text-on-surface">Question Matrix</h2>
</div>
<span class="text-xs font-label text-on-surface-variant font-medium">1 / 20 Flagged</span>
</div>
<!-- 20 Question Button Grid -->
<div class="grid grid-cols-5 gap-2.5 pt-1">
<!-- Q1 Answered -->
<button class="h-10 rounded-lg bg-primary text-on-primary font-label text-xs font-bold transition-transform hover:scale-105 shadow-sm" type="button">
              01
            </button>
<!-- Q2 Answered -->
<button class="h-10 rounded-lg bg-primary text-on-primary font-label text-xs font-bold transition-transform hover:scale-105 shadow-sm" type="button">
              02
            </button>
<!-- Q3 Answered -->
<button class="h-10 rounded-lg bg-primary text-on-primary font-label text-xs font-bold transition-transform hover:scale-105 shadow-sm" type="button">
              03
            </button>
<!-- Q4 Flagged (Amber/Terracotta Variant) -->
<button class="h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-label text-xs font-bold flex items-center justify-center relative transition-transform hover:scale-105" type="button">
<span>04</span>
<span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary"></span>
</button>
<!-- Q5 Answered -->
<button class="h-10 rounded-lg bg-primary text-on-primary font-label text-xs font-bold transition-transform hover:scale-105 shadow-sm" type="button">
              05
            </button>
<!-- Q6 Answered -->
<button class="h-10 rounded-lg bg-primary text-on-primary font-label text-xs font-bold transition-transform hover:scale-105 shadow-sm" type="button">
              06
            </button>
<!-- Q7 Active (Current Question) -->
<button class="h-10 rounded-lg bg-surface-container-high ring-2 ring-primary text-primary font-label text-xs font-extrabold flex items-center justify-center shadow-sm" type="button">
              07
            </button>
<!-- Q8 to Q20 Unvisited / Pending -->
<button class="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label text-xs font-medium transition-colors" type="button">
              08
            </button>
<button class="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label text-xs font-medium transition-colors" type="button">
              09
            </button>
<button class="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label text-xs font-medium transition-colors" type="button">
              10
            </button>
<button class="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label text-xs font-medium transition-colors" type="button">
              11
            </button>
<button class="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label text-xs font-medium transition-colors" type="button">
              12
            </button>
<button class="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label text-xs font-medium transition-colors" type="button">
              13
            </button>
<button class="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label text-xs font-medium transition-colors" type="button">
              14
            </button>
<button class="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label text-xs font-medium transition-colors" type="button">
              15
            </button>
<button class="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label text-xs font-medium transition-colors" type="button">
              16
            </button>
<button class="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label text-xs font-medium transition-colors" type="button">
              17
            </button>
<button class="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label text-xs font-medium transition-colors" type="button">
              18
            </button>
<button class="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label text-xs font-medium transition-colors" type="button">
              19
            </button>
<button class="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label text-xs font-medium transition-colors" type="button">
              20
            </button>
</div>
<!-- Color Key Legends -->
<div class="mt-5 pt-4 flex items-center justify-between text-[11px] font-label text-on-surface-variant">
<span class="flex items-center gap-1.5">
<span class="w-2.5 h-2.5 rounded-sm bg-primary"></span>
              Answered (6)
            </span>
<span class="flex items-center gap-1.5">
<span class="w-2.5 h-2.5 rounded-sm bg-tertiary-fixed"></span>
              Flagged (1)
            </span>
<span class="flex items-center gap-1.5">
<span class="w-2.5 h-2.5 rounded-sm bg-surface-container"></span>
              Remaining (13)
            </span>
</div>
</div>
<!-- Mastery & Metacognitive Confidence Self-Rating Slider -->
<div class="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
<div class="flex items-center justify-between pb-3">
<span class="text-xs font-label font-bold uppercase tracking-wider text-primary flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">psychology</span>
              Confidence Calibration
            </span>
<span class="px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed text-[11px] font-bold font-label" id="confidence-level-badge">
              High (85%)
            </span>
</div>
<p class="text-xs text-on-surface-variant font-medium leading-relaxed pb-4">
            How confident are you in this answer? StudyTantra adjusts future spaced interval decay curves based on subjective certainty.
          </p>
<!-- Range Bar Slider -->
<div class="space-y-3">
<input class="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none" id="confidence-slider" max="3" min="1" oninput="handleConfidenceChange(this.value)" step="1" type="range" value="3"/>
<div class="flex justify-between text-[11px] font-label font-medium text-on-surface-variant">
<span>Low (Guess)</span>
<span>Medium (Partial)</span>
<span class="text-primary font-bold">High (Certain)</span>
</div>
</div>
</div>
<!-- AI Tutor Socratic Hint Box -->
<div class="bg-surface-container-low rounded-2xl p-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)] relative overflow-hidden">
<div class="flex items-start gap-3.5">
<div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary flex-shrink-0 shadow-sm">
<span class="material-symbols-outlined text-[22px]">auto_awesome</span>
</div>
<div class="flex-1">
<span class="text-[10px] font-label font-bold uppercase tracking-widest text-primary">Tantra AI Socrates</span>
<h3 class="text-sm font-semibold text-on-surface pt-0.5">Stuck on validation semantics?</h3>
<p class="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Receive a guided, non-spoiling hint that breaks down the difference between Backward (BOCC) and Forward validation.
              </p>
<button class="mt-3.5 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-lowest text-primary text-xs font-label font-bold hover:bg-primary hover:text-on-primary transition-all duration-150 shadow-sm" id="hint-btn" onclick="revealAiHint()" type="button">
<span class="material-symbols-outlined text-[16px]">lightbulb</span>
<span>Ask Tantra for Socratic hint</span>
</button>
<div class="hidden mt-3 p-3 rounded-lg bg-surface-container-lowest text-xs text-on-surface leading-relaxed animate-fadeIn" id="ai-hint-box">
<span class="font-bold text-primary block pb-1">Socratic Clue:</span>
                FOCC checks writes against active reads, not committed past reads. Who holds the lock on what item? Notice who is reading Y before T1 flushes Y!
              </div>
</div>
</div>
</div>
<!-- Live Session Diagnostic Stats -->
<div class="p-5 rounded-2xl bg-surface-container-lowest shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex items-center justify-between">
<div class="flex items-center gap-3">
<span class="p-2 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">speed</span>
</span>
<div class="flex flex-col">
<span class="text-[10px] uppercase font-label font-semibold text-on-surface-variant">Avg Pace</span>
<span class="text-xs font-bold text-on-surface">1m 18s / question</span>
</div>
</div>
<div class="text-right">
<span class="text-[10px] uppercase font-label font-semibold text-on-surface-variant">Retention Accuracy</span>
<span class="text-xs font-bold text-primary block">85.7%</span>
</div>
</div>
</aside>
</div>
<!-- Bottom Navigation & Action Bar -->
<div class="mt-10 pt-6 flex flex-wrap items-center justify-between gap-4 border-none bg-surface-container-lowest p-6 rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
<!-- Left side: Previous action -->
<button class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-container text-on-surface text-xs font-label font-bold hover:bg-surface-container-high transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">arrow_back</span>
<span>Previous Question</span>
</button>
<!-- Center & Right side: Flag & Submit Navigation -->
<div class="flex items-center gap-3 ml-auto">
<button class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-tertiary hover:bg-tertiary-fixed/40 text-xs font-label font-semibold transition-colors" id="flag-question-btn" onclick="toggleFlag()" type="button">
<span class="material-symbols-outlined text-[18px]" id="flag-icon">flag</span>
<span id="flag-text">Flag for Review</span>
</button>
<button class="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-label font-bold hover:bg-primary-container hover:text-on-primary-container shadow-md transition-all duration-150 transform active:scale-95" type="button">
<span>Submit &amp; Next Question</span>
<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>
<script>
  // Simple interactive micro-behaviors
  function selectChoice(cardEl) {
    const container = document.getElementById('answers-container');
    const cards = container.getElementsByClassName('choice-card');

    // Reset all cards
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      c.classList.remove('ring-2', 'ring-primary', 'bg-surface-container-lowest');
      c.classList.add('bg-surface-container-lowest', 'hover:bg-surface-container-low');
      const badge = c.querySelector('.rounded-full');
      if (badge) {
        badge.className = 'mt-0.5 w-6 h-6 rounded-full bg-surface-container-high group-hover:bg-primary/20 flex items-center justify-center text-on-surface-variant group-hover:text-primary flex-shrink-0 transition-colors';
        const label = String.fromCharCode(65 + i);
        badge.innerHTML = `<span class="text-xs font-bold font-label">${label}</span>`;
      }
      const titleSpan = c.querySelector('.font-label');
      if (titleSpan) {
        titleSpan.textContent = `Option ${String.fromCharCode(65 + i)}`;
        titleSpan.className = 'text-xs font-label font-medium text-on-surface-variant uppercase tracking-wider';
      }
    }

    // Set selected on clicked card
    cardEl.classList.remove('hover:bg-surface-container-low');
    cardEl.classList.add('ring-2', 'ring-primary');
    const activeBadge = cardEl.querySelector('.rounded-full');
    if (activeBadge) {
      activeBadge.className = 'mt-0.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0 shadow-sm';
      activeBadge.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span>';
    }
    const activeTitle = cardEl.querySelector('.font-label');
    if (activeTitle) {
      activeTitle.textContent = `${activeTitle.textContent.split(' ')[0]} ${activeTitle.textContent.split(' ')[1] || ''} (Selected)`.trim();
      activeTitle.className = 'text-xs font-label font-bold text-primary uppercase tracking-wider';
    }
  }

  function toggleExplanation() {
    const body = document.getElementById('explanation-body');
    const chevron = document.getElementById('explanation-chevron');
    const text = document.getElementById('explanation-state-text');
    if (body.classList.contains('hidden')) {
      body.classList.remove('hidden');
      chevron.style.transform = 'rotate(180deg)';
      text.textContent = 'Collapse Rationale';
    } else {
      body.classList.add('hidden');
      chevron.style.transform = 'rotate(0deg)';
      text.textContent = 'Expand Rationale';
    }
  }

  function handleConfidenceChange(val) {
    const badge = document.getElementById('confidence-level-badge');
    if (val === '1') {
      badge.textContent = 'Low (30%)';
      badge.className = 'px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-[11px] font-bold font-label';
    } else if (val === '2') {
      badge.textContent = 'Medium (60%)';
      badge.className = 'px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[11px] font-bold font-label';
    } else {
      badge.textContent = 'High (85%)';
      badge.className = 'px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed text-[11px] font-bold font-label';
    }
  }

  function revealAiHint() {
    const hintBox = document.getElementById('ai-hint-box');
    const hintBtn = document.getElementById('hint-btn');
    hintBox.classList.toggle('hidden');
    if (!hintBox.classList.contains('hidden')) {
      hintBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span><span>Hint Dispatched</span>';
    }
  }

  let isFlagged = false;
  function toggleFlag() {
    isFlagged = !isFlagged;
    const icon = document.getElementById('flag-icon');
    const text = document.getElementById('flag-text');
    const btn = document.getElementById('flag-question-btn');
    if (isFlagged) {
      icon.style.fontVariationSettings = "'FILL' 1";
      btn.classList.add('text-tertiary', 'bg-tertiary-fixed');
      text.textContent = 'Flagged';
    } else {
      icon.style.fontVariationSettings = "'FILL' 0";
      btn.classList.remove('text-tertiary', 'bg-tertiary-fixed');
      text.textContent = 'Flag for Review';
    }
  }

  // Realistic countdown simulator
  let totalSeconds = 24 * 60 + 15;
  const timerDisplay = document.getElementById('quiz-countdown');
  setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }, 1000);
</script></main></div></body></html>

<!-- StudyTantra - Spaced Review Session (Sahara Edition) -->
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;family=Manrope:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "surface-container": "#f2ece4", "on-tertiary-container": "#3a2020", "surface-bright": "#faf5ee", "primary": "#c2652a", "on-surface-variant": "#605850", "outline-variant": "#d8d0c8", "error": "#c0392b", "primary-fixed": "#fbe8d8", "surface-container-low": "#f6f0e8", "on-background": "#3a302a", "on-error": "#ffffff", "secondary-container": "#eae2da", "on-primary-container": "#fbe8d8", "on-secondary-container": "#605850", "on-secondary-fixed-variant": "#504840", "error-container": "#fce4e0", "secondary": "#78706a", "on-primary-fixed": "#401a08", "primary-container": "#e08850", "background": "#faf5ee", "on-secondary-fixed": "#2a2420", "on-surface": "#3a302a", "secondary-fixed": "#eae2da", "on-error-container": "#7a1a10", "primary-fixed-dim": "#f0a878", "surface": "#faf5ee", "inverse-primary": "#f0a878", "on-secondary": "#ffffff", "inverse-surface": "#3a302a", "tertiary-fixed-dim": "#e8a0a0", "tertiary-container": "#d47070", "inverse-on-surface": "#faf5ee", "outline": "#9a9088", "surface-container-high": "#ece6dc", "surface-dim": "#dcd6cc", "surface-container-lowest": "#ffffff", "tertiary": "#8c3c3c", "surface-variant": "#ece6dc", "on-primary": "#ffffff", "surface-container-highest": "#e6e0d6", "on-tertiary-fixed": "#2e1515", "surface-tint": "#c2652a", "on-tertiary-fixed-variant": "#6e3030", "on-tertiary": "#ffffff", "tertiary-fixed": "#fce0e0", "on-primary-fixed-variant": "#8a4518", "secondary-fixed-dim": "#cec6be" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": {}, "fontFamily": { "headline": [ "EB Garamond" ], "display": [ "EB Garamond" ], "body": [ "Manrope" ], "label": [ "Manrope" ] }, "fontSize": {} } } }</script></head><body class="bg-surface font-body text-on-surface antialiased"><aside class="fixed left-0 top-0 h-screen w-72 bg-surface-container-low shadow-[0_1px_8px_rgba(58,48,42,0.04)] z-50 flex flex-col justify-between py-6 px-5"><div class="flex flex-col"><div class="px-3 pb-6 flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm"><span class="material-symbols-outlined text-2xl">local_fire_department</span></div><div class="flex flex-col"><span class="font-headline text-2xl font-bold tracking-tight text-on-surface leading-none">StudyTantra</span><span class="text-[11px] font-label font-medium tracking-wide uppercase text-on-surface-variant mt-1">AI Spaced Recall</span></div></div><nav class="flex flex-col gap-1.5 mt-2" data-active-classes="bg-primary-container text-on-primary font-semibold shadow-sm"><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[20px]">grid_view</span><span>Dashboard</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="document-library" href="#"><span class="material-symbols-outlined text-[20px]">menu_book</span><span>Document Library</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="flashcards-vault" href="#"><span class="material-symbols-outlined text-[20px]">style</span><span>Flashcards Vault</span></a><a aria-current="page" class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors bg-primary-container text-on-primary font-semibold shadow-sm" data-path="spaced-review" href="#"><span class="material-symbols-outlined text-[20px]">neurology</span><span>Spaced Review</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="exam-planner" href="#"><span class="material-symbols-outlined text-[20px]">event_upcoming</span><span>Exam Planner</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="quiz-engine" href="#"><span class="material-symbols-outlined text-[20px]">bolt</span><span>Quiz Engine</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="settings" href="#"><span class="material-symbols-outlined text-[20px]">settings</span><span>Settings</span></a></nav></div><div class="flex flex-col gap-4 px-1"><div class="p-4 rounded-xl bg-surface-container flex items-center justify-between shadow-[0_2px_16px_rgba(58,48,42,0.04)]"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[22px]">flare</span></div><div class="flex flex-col"><span class="text-[11px] font-label font-medium uppercase text-on-surface-variant">Mindful Habit</span><span class="text-xs font-semibold text-on-surface">14 Days Streak</span></div></div><span class="text-xs font-bold text-primary font-label bg-surface px-2 py-1 rounded-md">Lv. 4</span></div><div class="flex items-center justify-between pt-2 border-t border-outline-variant/40"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div><div class="flex flex-col"><span class="text-xs font-semibold text-on-surface leading-snug">Arya Sharma</span><span class="text-[10px] text-on-surface-variant">Scholar Plan</span></div></div><button aria-label="Account switcher" class="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">unfold_more</span></button></div></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 z-40 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(58,48,42,0.04)]"><div class="h-16 w-full px-8 flex items-center justify-between gap-6"><div class="flex-1 max-w-xl"><div class="relative flex items-center"><span class="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">search</span><input class="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="Search concepts, textbooks, notes, formulas..." type="text"/></div></div><div class="flex items-center gap-3"><div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-xs text-on-surface"><span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span><span class="font-label font-medium text-[11px] text-on-surface-variant">Active Deck:</span><span class="font-semibold text-primary text-[11px]">Cognitive Neuroscience</span></div><button aria-label="Notifications" class="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary"></span></button><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="relative pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<!-- Top Session Navigation & Adaptive Progress Header -->
<section class="sticky top-16 z-30 bg-surface/90 backdrop-blur-md px-8 py-4 shadow-sm transition-all duration-300">
<div class="max-w-6xl mx-auto flex flex-col gap-3">
<div class="flex items-center justify-between gap-4">
<div class="flex items-center gap-3">
<a class="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors flex items-center justify-center shadow-sm" href="#" title="Exit Review to Vault">
<span class="material-symbols-outlined text-[19px]">arrow_back</span>
</a>
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="text-[10px] uppercase tracking-widest font-label font-bold text-primary">Active Recall Session</span>
<span class="w-1 h-1 rounded-full bg-outline"></span>
<span class="text-[11px] font-label text-on-surface-variant font-medium">FSRS-4.5 Scheduler</span>
</div>
<h1 class="font-headline text-xl font-bold tracking-tight text-on-surface leading-tight">CS-402: Database Management Systems</h1>
</div>
</div>
<div class="flex items-center gap-6">
<!-- Session Timer Badge -->
<div class="flex items-center gap-2 bg-surface-container-low px-3.5 py-1.5 rounded-full shadow-sm">
<span class="material-symbols-outlined text-[16px] text-primary animate-pulse">timer</span>
<span class="font-label text-xs font-semibold text-on-surface" id="sessionTimer">18:24</span>
</div>
<!-- Card Progress Counter -->
<div class="flex items-center gap-2">
<span class="text-xs font-label font-medium text-on-surface-variant">Card</span>
<span class="text-sm font-label font-bold text-on-surface">14</span>
<span class="text-xs font-label text-outline font-medium">/ 42</span>
</div>
<!-- Quick Deck Action -->
<button class="hidden sm:flex p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" title="Session Options" type="button">
<span class="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</div>
</div>
<!-- Linear Micro Progress Bar -->
<div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden flex items-center">
<div class="bg-primary h-full rounded-full transition-all duration-500 ease-out" style="width: 33.3%;"></div>
</div>
</div>
</section>
<!-- Main Focus Arena: Spaced Card Canvas -->
<main class="w-full max-w-5xl mx-auto px-6 py-8 flex flex-col gap-6">
<!-- Primary Interactive Recall Stage -->
<article class="relative w-full rounded-2xl bg-surface-container-lowest p-8 md:p-12 shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col transition-all">
<!-- Top Card Metadata Ribbon -->
<div class="flex flex-wrap items-center justify-between gap-3 pb-6">
<div class="flex flex-wrap items-center gap-2.5">
<span class="px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container text-[11px] font-label font-semibold tracking-wide uppercase">
            Concept Comparison
          </span>
<span class="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-label font-medium">
            Difficulty: 0.42
          </span>
<span class="flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-fixed text-on-primary-fixed text-[11px] font-label font-bold">
<span class="material-symbols-outlined text-[13px]">neurology</span>
            FSRS-4.5
          </span>
</div>
<div class="flex items-center gap-3">
<a class="group flex items-center gap-1.5 text-xs font-label text-primary font-semibold hover:text-on-primary-fixed-variant transition-colors" href="#citation-drawer">
<span class="material-symbols-outlined text-[15px]">auto_stories</span>
<span>Silberschatz p. 714</span>
<span class="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">arrow_outward</span>
</a>
<button class="p-1.5 rounded text-on-surface-variant hover:bg-surface-container transition-colors" title="Bookmark card" type="button">
<span class="material-symbols-outlined text-[18px]">bookmark_border</span>
</button>
</div>
</div>
<!-- Question / Target Prompt Section -->
<div class="pt-2 pb-8">
<span class="text-[11px] font-label font-bold tracking-widest text-primary uppercase">Active Query</span>
<h2 class="font-headline text-2xl md:text-3xl lg:text-[34px] font-normal text-on-surface leading-tight mt-2">
          Explain the operational distinction between Optimistic Concurrency Control (OCC) and Two-Phase Locking (2PL) in transactional engines.
        </h2>
</div>
<!-- Reveal Divider Line -->
<div class="relative w-full my-2 flex items-center justify-center">
<div class="w-full h-px bg-surface-container"></div>
<span class="absolute px-3 py-0.5 bg-surface-container-lowest text-[10px] font-label uppercase tracking-widest text-outline font-semibold">
          Answer &amp; Mental Anchor
        </span>
</div>
<!-- Revealed Structural Answer Zone -->
<div class="flex flex-col gap-8 pt-8" id="revealedContent">
<!-- Comparative Bento Breakdown -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
<!-- Column 1: Two-Phase Locking (Pessimistic) -->
<div class="p-6 rounded-xl bg-surface-container-low flex flex-col justify-between shadow-sm">
<div>
<div class="flex items-center justify-between pb-3">
<div class="flex items-center gap-2">
<div class="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
<span class="material-symbols-outlined text-[17px]">lock</span>
</div>
<h3 class="font-headline text-xl font-bold text-on-surface">Two-Phase Locking (2PL)</h3>
</div>
<span class="px-2 py-0.5 rounded text-[10px] font-label font-bold bg-secondary-fixed text-on-secondary-fixed uppercase tracking-wider">
                  Pessimistic
                </span>
</div>
<p class="text-xs font-body text-on-surface-variant leading-relaxed mb-4">
                Assumes conflict is frequent and pre-emptively blocks concurrent access by acquiring explicit locks before reading or modifying data items.
              </p>
<div class="space-y-2.5">
<div class="flex items-start gap-2 text-xs">
<span class="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">check_circle</span>
<span class="text-on-surface"><strong class="font-semibold text-on-surface">Phase Mechanics:</strong> Expanding (locks acquired, none released) followed strictly by Shrinking (locks released).</span>
</div>
<div class="flex items-start gap-2 text-xs">
<span class="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">check_circle</span>
<span class="text-on-surface"><strong class="font-semibold text-on-surface">Serializability:</strong> Guaranteed serialization order governed by lock acquisition points.</span>
</div>
<div class="flex items-start gap-2 text-xs">
<span class="material-symbols-outlined text-tertiary text-[16px] shrink-0 mt-0.5">warning</span>
<span class="text-on-surface"><strong class="font-semibold text-on-surface">Vulnerability:</strong> Susceptible to deadlocks and long latch waiting times during hotspot writes.</span>
</div>
</div>
</div>
<!-- Micro Metrics Tag -->
<div class="mt-5 pt-3 flex items-center justify-between text-[11px] font-label text-on-surface-variant bg-surface-container px-3 py-2 rounded-lg">
<span>Lock Overhead: High</span>
<span>Abort Penalty: Low</span>
</div>
</div>
<!-- Column 2: Optimistic Concurrency Control (OCC) -->
<div class="p-6 rounded-xl bg-surface-container flex flex-col justify-between shadow-sm">
<div>
<div class="flex items-center justify-between pb-3">
<div class="flex items-center gap-2">
<div class="w-7 h-7 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[17px]">bolt</span>
</div>
<h3 class="font-headline text-xl font-bold text-on-surface">Optimistic Concurrency (OCC)</h3>
</div>
<span class="px-2 py-0.5 rounded text-[10px] font-label font-bold bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">
                  Optimistic
                </span>
</div>
<p class="text-xs font-body text-on-surface-variant leading-relaxed mb-4">
                Assumes conflicts are exceptional; reads occur unobstructed in private workspaces, and validation certifies serializability before committing.
              </p>
<div class="space-y-2.5">
<div class="flex items-start gap-2 text-xs">
<span class="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">check_circle</span>
<span class="text-on-surface"><strong class="font-semibold text-on-surface">Phase Mechanics:</strong> Read Phase (local cache) → Validation Phase (conflict check) → Write Phase (global commit).</span>
</div>
<div class="flex items-start gap-2 text-xs">
<span class="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">check_circle</span>
<span class="text-on-surface"><strong class="font-semibold text-on-surface">Validation Modes:</strong> BOCC (backward-oriented) or FOCC (forward-oriented) timestamps.</span>
</div>
<div class="flex items-start gap-2 text-xs">
<span class="material-symbols-outlined text-tertiary text-[16px] shrink-0 mt-0.5">warning</span>
<span class="text-on-surface"><strong class="font-semibold text-on-surface">Vulnerability:</strong> Cascade abort storms and starvation under high-contention update workloads.</span>
</div>
</div>
</div>
<!-- Micro Metrics Tag -->
<div class="mt-5 pt-3 flex items-center justify-between text-[11px] font-label text-on-surface-variant bg-surface-container-high px-3 py-2 rounded-lg">
<span>Lock Overhead: None</span>
<span>Abort Penalty: High</span>
</div>
</div>
</div>
<!-- Heuristic Decision Rule Callout -->
<div class="p-5 rounded-xl bg-primary-fixed/40 flex items-start gap-4 shadow-sm">
<div class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-sm mt-0.5">
<span class="material-symbols-outlined text-[20px]">lightbulb</span>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="text-xs font-label font-bold uppercase tracking-wider text-primary">System Architecture Rule of Thumb</span>
<span class="text-[11px] text-on-surface-variant">• Production Selection</span>
</div>
<p class="font-body text-xs md:text-sm text-on-surface leading-relaxed mt-1">
              Deploy <strong class="font-semibold text-primary">OCC</strong> for read-intensive analytical systems or memory-centric DBs where contention probability &lt; 3%. Reserve <strong class="font-semibold text-on-surface">Strict 2PL (or MVCC+2PL)</strong> for heavy enterprise banking and reservation ledgers with repeated write collisions to eliminate catastrophic transaction rollback cascades.
            </p>
</div>
</div>
</div>
</article>
<!-- Cognitive Recall Response Dock (FSRS-4.5 Grading Matrix) -->
<section class="w-full flex flex-col gap-4">
<div class="flex items-center justify-between px-2">
<span class="text-xs font-label uppercase tracking-wider font-semibold text-on-surface-variant">Cognitive Feedback Rate (FSRS-4.5)</span>
<span class="text-[11px] font-label text-outline">Adjusts memory stability &amp; retrievability curves</span>
</div>
<!-- The 4 Response Action Cards -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-3.5">
<!-- Button 1: Again -->
<button class="group relative flex flex-col items-center justify-between p-4 rounded-xl bg-surface-container-lowest hover:bg-error-container text-on-surface hover:text-on-error-container transition-all shadow-sm active:scale-[0.98] text-center" onclick="recordRecallGrade('again')" type="button">
<div class="flex items-center justify-between w-full">
<span class="w-5 h-5 rounded flex items-center justify-center text-[10px] font-label font-bold bg-surface-container text-on-surface-variant group-hover:bg-error/20 group-hover:text-error">1</span>
<span class="text-[10px] font-label uppercase tracking-widest text-error font-bold">&lt; 10m</span>
</div>
<div class="my-2 flex flex-col items-center">
<span class="font-headline text-lg font-bold">Again</span>
<span class="text-[11px] font-label text-on-surface-variant group-hover:text-on-error-container">Reset Interval</span>
</div>
<span class="text-[10px] font-label text-outline group-hover:text-error">Memory Lapse</span>
</button>
<!-- Button 2: Hard -->
<button class="group relative flex flex-col items-center justify-between p-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-on-surface transition-all shadow-sm active:scale-[0.98] text-center" onclick="recordRecallGrade('hard')" type="button">
<div class="flex items-center justify-between w-full">
<span class="w-5 h-5 rounded flex items-center justify-center text-[10px] font-label font-bold bg-surface-container text-on-surface-variant group-hover:bg-secondary-container">2</span>
<span class="text-[10px] font-label uppercase tracking-widest text-secondary font-bold">1.2 d</span>
</div>
<div class="my-2 flex flex-col items-center">
<span class="font-headline text-lg font-bold">Hard</span>
<span class="text-[11px] font-label text-on-surface-variant">Struggled Recall</span>
</div>
<span class="text-[10px] font-label text-outline">Retrievability 65%</span>
</button>
<!-- Button 3: Good (Primary CTA Spacing) -->
<button class="group relative flex flex-col items-center justify-between p-4 rounded-xl bg-primary text-on-primary shadow-md hover:bg-primary-container transition-all active:scale-[0.98] text-center ring-2 ring-primary-fixed" onclick="recordRecallGrade('good')" type="button">
<div class="flex items-center justify-between w-full">
<span class="w-5 h-5 rounded flex items-center justify-center text-[10px] font-label font-bold bg-primary-fixed text-on-primary-fixed">3</span>
<span class="text-[10px] font-label uppercase tracking-widest text-primary-fixed font-bold">3.5 d</span>
</div>
<div class="my-2 flex flex-col items-center">
<span class="font-headline text-lg font-bold">Good</span>
<span class="text-[11px] font-label text-on-primary/90">Optimal Spacing</span>
</div>
<span class="text-[10px] font-label text-primary-fixed/80">Target Stability 90%</span>
</button>
<!-- Button 4: Easy -->
<button class="group relative flex flex-col items-center justify-between p-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface transition-all shadow-sm active:scale-[0.98] text-center" onclick="recordRecallGrade('easy')" type="button">
<div class="flex items-center justify-between w-full">
<span class="w-5 h-5 rounded flex items-center justify-center text-[10px] font-label font-bold bg-surface-container text-on-surface-variant group-hover:bg-surface-container-high">4</span>
<span class="text-[10px] font-label uppercase tracking-widest text-primary font-bold">7.8 d</span>
</div>
<div class="my-2 flex flex-col items-center">
<span class="font-headline text-lg font-bold">Easy</span>
<span class="text-[11px] font-label text-on-surface-variant">Instant Retrieval</span>
</div>
<span class="text-[10px] font-label text-outline">High Mastery</span>
</button>
</div>
<!-- Keyboard Shortcut Instruction Strip -->
<div class="w-full flex flex-wrap items-center justify-center gap-6 py-2 text-[11px] font-label text-on-surface-variant">
<span class="inline-flex items-center gap-1.5">
<kbd class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-semibold text-[10px] shadow-sm">Space</kbd>
<span>Reveal Answer</span>
</span>
<span class="inline-flex items-center gap-1.5">
<kbd class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-semibold text-[10px] shadow-sm">1 - 4</kbd>
<span>Rate Recall</span>
</span>
<span class="inline-flex items-center gap-1.5">
<kbd class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-semibold text-[10px] shadow-sm">E</kbd>
<span>Edit Flashcard</span>
</span>
<span class="inline-flex items-center gap-1.5">
<kbd class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-semibold text-[10px] shadow-sm">Z</kbd>
<span>Undo Previous</span>
</span>
</div>
</section>
<!-- Bottom Collapsible Academic Excerpt Drawer -->
<details class="group rounded-2xl bg-surface-container-low transition-all duration-300 shadow-sm overflow-hidden mb-12" id="citation-drawer">
<summary class="flex items-center justify-between p-5 cursor-pointer list-none select-none hover:bg-surface-container transition-colors">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[19px]">format_quote</span>
</div>
<div class="flex flex-col">
<span class="text-xs font-label font-bold text-on-surface">Silberschatz, Korth &amp; Sudarshan — Database System Concepts (7th Ed.)</span>
<span class="text-[11px] font-label text-on-surface-variant">Chapter 19: Concurrency Control • Section 19.4 Optimistic Timestamp Validation, pp. 713–716</span>
</div>
</div>
<div class="flex items-center gap-2 text-on-surface-variant group-open:rotate-180 transition-transform">
<span class="material-symbols-outlined text-[20px]">expand_more</span>
</div>
</summary>
<div class="p-6 md:p-8 pt-2 bg-surface-container-low flex flex-col gap-4">
<div class="p-5 rounded-xl bg-surface-container-lowest text-xs md:text-sm font-headline italic text-on-surface leading-relaxed shadow-sm">
          “In workloads where transaction collision frequency is low, locking imposes an unnecessary overhead of acquiring and granting latches, and introduces the hazards of deadlock cycles. Optimistic concurrency algorithms shift verification to the validation phase: each transaction performs write operations solely on local private working copies. Serialization correctness is affirmed by examining intersections between write sets and active read sets prior to atomic state propagation.”
        </div>
<div class="flex flex-wrap items-center justify-between text-xs text-on-surface-variant pt-2">
<div class="flex items-center gap-4">
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[15px] text-primary">bookmark</span> Section 19.4.2</span>
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[15px] text-outline">verified</span> Verified Syllabus Reference</span>
</div>
<a class="text-primary font-label font-semibold hover:underline inline-flex items-center gap-1" href="#">
            Open in Document Library
            <span class="material-symbols-outlined text-[14px]">open_in_new</span>
</a>
</div>
</div>
</details>
</main>
</div>
<script>
  // Simple session timer simulation
  let secondsElapsed = 18 * 60 + 24;
  const timerElement = document.getElementById('sessionTimer');
  setInterval(() => {
    secondsElapsed++;
    const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
    const secs = String(secondsElapsed % 60).padStart(2, '0');
    if (timerElement) timerElement.textContent = `${mins}:${secs}`;
  }, 1000);

  // Micro interaction mock for FSRS grading
  function recordRecallGrade(rating) {
    const cardEl = document.querySelector('article');
    if (!cardEl) return;
    cardEl.classList.add('opacity-40', 'scale-[0.99]');
    setTimeout(() => {
      cardEl.classList.remove('opacity-40', 'scale-[0.99]');
    }, 280);
  }

  // Keyboard shortcut listener
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Digit1') recordRecallGrade('again');
    if (e.code === 'Digit2') recordRecallGrade('hard');
    if (e.code === 'Digit3') recordRecallGrade('good');
    if (e.code === 'Digit4') recordRecallGrade('easy');
    if (e.code === 'KeyE') {
      console.log('Edit Flashcard Triggered');
    }
  });
</script></main></div></body></html>

<!-- StudyTantra - Semester Exam Planner (Sahara Edition) -->
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;family=Manrope:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "surface-container": "#f2ece4", "on-tertiary-container": "#3a2020", "surface-bright": "#faf5ee", "primary": "#c2652a", "on-surface-variant": "#605850", "outline-variant": "#d8d0c8", "error": "#c0392b", "primary-fixed": "#fbe8d8", "surface-container-low": "#f6f0e8", "on-background": "#3a302a", "on-error": "#ffffff", "secondary-container": "#eae2da", "on-primary-container": "#fbe8d8", "on-secondary-container": "#605850", "on-secondary-fixed-variant": "#504840", "error-container": "#fce4e0", "secondary": "#78706a", "on-primary-fixed": "#401a08", "primary-container": "#e08850", "background": "#faf5ee", "on-secondary-fixed": "#2a2420", "on-surface": "#3a302a", "secondary-fixed": "#eae2da", "on-error-container": "#7a1a10", "primary-fixed-dim": "#f0a878", "surface": "#faf5ee", "inverse-primary": "#f0a878", "on-secondary": "#ffffff", "inverse-surface": "#3a302a", "tertiary-fixed-dim": "#e8a0a0", "tertiary-container": "#d47070", "inverse-on-surface": "#faf5ee", "outline": "#9a9088", "surface-container-high": "#ece6dc", "surface-dim": "#dcd6cc", "surface-container-lowest": "#ffffff", "tertiary": "#8c3c3c", "surface-variant": "#ece6dc", "on-primary": "#ffffff", "surface-container-highest": "#e6e0d6", "on-tertiary-fixed": "#2e1515", "surface-tint": "#c2652a", "on-tertiary-fixed-variant": "#6e3030", "on-tertiary": "#ffffff", "tertiary-fixed": "#fce0e0", "on-primary-fixed-variant": "#8a4518", "secondary-fixed-dim": "#cec6be" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": {}, "fontFamily": { "headline": [ "EB Garamond" ], "display": [ "EB Garamond" ], "body": [ "Manrope" ], "label": [ "Manrope" ] }, "fontSize": {} } } }</script></head><body class="bg-surface font-body text-on-surface antialiased"><aside class="fixed left-0 top-0 h-screen w-72 bg-surface-container-low shadow-[0_1px_8px_rgba(58,48,42,0.04)] z-50 flex flex-col justify-between py-6 px-5"><div class="flex flex-col"><div class="px-3 pb-6 flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm"><span class="material-symbols-outlined text-2xl">local_fire_department</span></div><div class="flex flex-col"><span class="font-headline text-2xl font-bold tracking-tight text-on-surface leading-none">StudyTantra</span><span class="text-[11px] font-label font-medium tracking-wide uppercase text-on-surface-variant mt-1">AI Spaced Recall</span></div></div><nav class="flex flex-col gap-1.5 mt-2" data-active-classes="bg-primary-container text-on-primary font-semibold shadow-sm"><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="dashboard" href="#"><span class="material-symbols-outlined text-[20px]">grid_view</span><span>Dashboard</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="document-library" href="#"><span class="material-symbols-outlined text-[20px]">menu_book</span><span>Document Library</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="flashcards-vault" href="#"><span class="material-symbols-outlined text-[20px]">style</span><span>Flashcards Vault</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="spaced-review" href="#"><span class="material-symbols-outlined text-[20px]">neurology</span><span>Spaced Review</span></a><a aria-current="page" class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors bg-primary-container text-on-primary font-semibold shadow-sm" data-path="exam-planner" href="#"><span class="material-symbols-outlined text-[20px]">event_upcoming</span><span>Exam Planner</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="quiz-engine" href="#"><span class="material-symbols-outlined text-[20px]">bolt</span><span>Quiz Engine</span></a><a class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="settings" href="#"><span class="material-symbols-outlined text-[20px]">settings</span><span>Settings</span></a></nav></div><div class="flex flex-col gap-4 px-1"><div class="p-4 rounded-xl bg-surface-container flex items-center justify-between shadow-[0_2px_16px_rgba(58,48,42,0.04)]"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[22px]">flare</span></div><div class="flex flex-col"><span class="text-[11px] font-label font-medium uppercase text-on-surface-variant">Mindful Habit</span><span class="text-xs font-semibold text-on-surface">14 Days Streak</span></div></div><span class="text-xs font-bold text-primary font-label bg-surface px-2 py-1 rounded-md">Lv. 4</span></div><div class="flex items-center justify-between pt-2 border-t border-outline-variant/40"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div><div class="flex flex-col"><span class="text-xs font-semibold text-on-surface leading-snug">Arya Sharma</span><span class="text-[10px] text-on-surface-variant">Scholar Plan</span></div></div><button aria-label="Account switcher" class="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">unfold_more</span></button></div></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 z-40 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(58,48,42,0.04)]"><div class="h-16 w-full px-8 flex items-center justify-between gap-6"><div class="flex-1 max-w-xl"><div class="relative flex items-center"><span class="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">search</span><input class="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="Search concepts, textbooks, notes, formulas..." type="text"/></div></div><div class="flex items-center gap-3"><div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-xs text-on-surface"><span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span><span class="font-label font-medium text-[11px] text-on-surface-variant">Active Deck:</span><span class="font-semibold text-primary text-[11px]">Cognitive Neuroscience</span></div><button aria-label="Notifications" class="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary"></span></button><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="relative pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<div class="px-8 py-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
<!-- Top Header & Context Banner -->
<header class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
<div class="flex flex-col gap-2">
<div class="flex items-center gap-2">
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-label font-bold uppercase tracking-wider bg-surface-container-high text-primary">
<span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Spring 2025 Semester
          </span>
<span class="text-xs text-on-surface-variant font-label font-medium">• 3 High-Priority Final Exams Approaching</span>
</div>
<h1 class="font-headline text-4xl lg:text-5xl font-medium tracking-tight text-on-surface leading-none">
          Semester Exam Planner &amp; Spaced Review Milestones
        </h1>
<p class="font-body text-sm text-on-surface-variant max-w-2xl mt-1">
          Algorithmic memory stabilization mapped against upcoming final deadlines. Dynamic workload rebalancing calibrated for peak cognitive consolidation.
        </p>
</div>
<!-- Quick Action Toolbar -->
<div class="flex items-center gap-3">
<button class="px-4 py-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label text-xs font-semibold transition-all shadow-sm flex items-center gap-2" type="button">
<span class="material-symbols-outlined text-[18px]">tune</span>
          Algorithm Tuning
        </button>
<button class="px-4 py-2.5 rounded-lg bg-primary text-on-primary hover:opacity-95 font-label text-xs font-semibold transition-all shadow-md flex items-center gap-2" type="button">
<span class="material-symbols-outlined text-[18px]">add_task</span>
          Schedule Mock Test
        </button>
</div>
</header>
<!-- Stat Metrology Cards -->
<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
<!-- Stat 1 -->
<div class="p-6 rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all">
<div class="flex items-start justify-between">
<span class="text-[11px] uppercase tracking-wider font-label font-bold text-on-surface-variant">Target Syllabus Coverage</span>
<div class="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary shadow-sm">
<span class="material-symbols-outlined text-[18px]">pie_chart</span>
</div>
</div>
<div class="mt-4 flex items-baseline gap-2">
<span class="font-headline text-3xl lg:text-4xl font-semibold text-on-surface">84.2%</span>
<span class="text-xs font-label font-bold text-primary flex items-center">
<span class="material-symbols-outlined text-[14px]">trending_up</span> +3.8%
          </span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
<div class="bg-primary h-full rounded-full transition-all duration-700" style="width: 84.2%"></div>
</div>
</div>
<!-- Stat 2 -->
<div class="p-6 rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all">
<div class="flex items-start justify-between">
<span class="text-[11px] uppercase tracking-wider font-label font-bold text-on-surface-variant">Scheduled Reviews</span>
<div class="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary-container text-on-surface shadow-sm">
<span class="material-symbols-outlined text-[18px]">auto_stories</span>
</div>
</div>
<div class="mt-4 flex items-baseline gap-2">
<span class="font-headline text-3xl lg:text-4xl font-semibold text-on-surface">142</span>
<span class="text-xs font-label text-on-surface-variant font-medium">Cards Today</span>
</div>
<p class="text-[11px] font-label text-on-surface-variant mt-3 flex items-center gap-1.5">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span> 38 due for urgent consolidation
        </p>
</div>
<!-- Stat 3 -->
<div class="p-6 rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all">
<div class="flex items-start justify-between">
<span class="text-[11px] uppercase tracking-wider font-label font-bold text-on-surface-variant">Next Major Milestone</span>
<div class="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-tertiary shadow-sm">
<span class="material-symbols-outlined text-[18px]">flag</span>
</div>
</div>
<div class="mt-4 flex flex-col">
<span class="font-headline text-2xl lg:text-3xl font-semibold text-tertiary">CS-402 DBMS</span>
<span class="text-xs font-label font-bold text-on-surface mt-0.5">In 9 Days (May 24)</span>
</div>
<div class="flex items-center gap-2 mt-3">
<span class="text-[11px] font-label text-on-surface-variant">Readiness:</span>
<span class="text-[11px] font-label font-bold text-primary">72%</span>
<span class="text-[10px] text-tertiary uppercase font-label font-semibold ml-auto">Needs Mock</span>
</div>
</div>
<!-- Stat 4 -->
<div class="p-6 rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all">
<div class="flex items-start justify-between">
<span class="text-[11px] uppercase tracking-wider font-label font-bold text-on-surface-variant">Optimal Daily Budget</span>
<div class="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary shadow-sm">
<span class="material-symbols-outlined text-[18px]">hourglass_top</span>
</div>
</div>
<div class="mt-4 flex items-baseline gap-2">
<span class="font-headline text-3xl lg:text-4xl font-semibold text-on-surface">2.5</span>
<span class="text-xs font-label text-on-surface-variant font-medium">hrs / day target</span>
</div>
<p class="text-[11px] font-label text-on-surface-variant mt-3 flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-primary">check_circle</span> Prevents memory interference
        </p>
</div>
</section>
<!-- Main Content Dual-Column Split -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
<!-- LEFT COLUMN (65% ~ 8 cols) -->
<section class="lg:col-span-8 flex flex-col gap-8">
<!-- Weekly Interactive Calendar Grid -->
<div class="p-7 rounded-2xl bg-surface-container-low shadow-sm flex flex-col gap-6">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div class="flex flex-col">
<span class="text-[11px] font-label uppercase tracking-widest text-on-surface-variant font-bold">Week 11 Spaced Repetition Matrix</span>
<h2 class="font-headline text-2xl font-semibold text-on-surface">Target Cadence: May 15 – May 21</h2>
</div>
<div class="flex items-center gap-2">
<div class="flex items-center gap-1 text-[11px] font-label text-on-surface-variant mr-3">
<span class="w-2.5 h-2.5 rounded-sm bg-primary-fixed"></span> Low
                <span class="w-2.5 h-2.5 rounded-sm bg-primary-container ml-1"></span> Mod
                <span class="w-2.5 h-2.5 rounded-sm bg-primary ml-1"></span> Peak
              </div>
<button aria-label="Previous week" class="p-1.5 rounded-lg bg-surface hover:bg-surface-container text-on-surface shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button aria-label="Next week" class="p-1.5 rounded-lg bg-surface hover:bg-surface-container text-on-surface shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
<!-- Day Grid -->
<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
<!-- Mon 15 -->
<div class="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all flex flex-col justify-between min-h-[148px] shadow-sm">
<div class="flex items-center justify-between">
<span class="text-[11px] font-label uppercase font-bold text-on-surface-variant">Mon</span>
<span class="text-xs font-headline font-semibold text-on-surface">15</span>
</div>
<div class="flex flex-col gap-1.5 my-2">
<div class="px-2 py-1 rounded bg-surface text-[10px] font-label font-semibold text-on-surface truncate flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span> 42 Cards
                </div>
<div class="px-2 py-1 rounded bg-secondary-container text-[10px] font-label text-on-surface-variant truncate">
                  SQL Ind. Drill
                </div>
</div>
<span class="text-[9px] font-label font-bold text-primary tracking-wide uppercase">1.8 hrs done</span>
</div>
<!-- Tue 16 -->
<div class="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all flex flex-col justify-between min-h-[148px] shadow-sm">
<div class="flex items-center justify-between">
<span class="text-[11px] font-label uppercase font-bold text-on-surface-variant">Tue</span>
<span class="text-xs font-headline font-semibold text-on-surface">16</span>
</div>
<div class="flex flex-col gap-1.5 my-2">
<div class="px-2 py-1 rounded bg-surface text-[10px] font-label font-semibold text-on-surface truncate flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span> 60 Cards
                </div>
<div class="px-2 py-1 rounded bg-surface text-[10px] font-label text-on-surface truncate">
                  Eigenvectors
                </div>
</div>
<span class="text-[9px] font-label font-bold text-primary tracking-wide uppercase">2.2 hrs done</span>
</div>
<!-- Wed 17 (Today) -->
<div class="p-3.5 rounded-xl bg-primary-fixed shadow-md flex flex-col justify-between min-h-[148px] relative transform scale-[1.02]">
<div class="flex items-center justify-between">
<span class="text-[11px] font-label uppercase font-bold text-primary">Today</span>
<span class="text-xs font-headline font-bold text-primary">17</span>
</div>
<div class="flex flex-col gap-1.5 my-2">
<div class="px-2 py-1 rounded bg-surface text-[10px] font-label font-bold text-primary flex items-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-[12px]">alarm</span> 142 Cards
                </div>
<div class="px-2 py-1 rounded bg-primary text-[10px] font-label text-on-primary font-medium truncate">
                  ACID Props &amp; B+ Trees
                </div>
</div>
<span class="text-[9px] font-label font-bold text-on-primary-fixed-variant tracking-wide uppercase">2.5 hrs sched.</span>
</div>
<!-- Thu 18 -->
<div class="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all flex flex-col justify-between min-h-[148px] shadow-sm">
<div class="flex items-center justify-between">
<span class="text-[11px] font-label uppercase font-bold text-on-surface-variant">Thu</span>
<span class="text-xs font-headline font-semibold text-on-surface">18</span>
</div>
<div class="flex flex-col gap-1.5 my-2">
<div class="px-2 py-1 rounded bg-surface text-[10px] font-label font-semibold text-on-surface truncate flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-primary-container"></span> 85 Cards
                </div>
<div class="px-2 py-1 rounded bg-secondary-container text-[10px] font-label text-on-surface-variant truncate">
                  Orthogonal Vector
                </div>
</div>
<span class="text-[9px] font-label font-bold text-on-surface-variant tracking-wide uppercase">2.0 hrs</span>
</div>
<!-- Fri 19 -->
<div class="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all flex flex-col justify-between min-h-[148px] shadow-sm">
<div class="flex items-center justify-between">
<span class="text-[11px] font-label uppercase font-bold text-on-surface-variant">Fri</span>
<span class="text-xs font-headline font-semibold text-on-surface">19</span>
</div>
<div class="flex flex-col gap-1.5 my-2">
<div class="px-2 py-1 rounded bg-tertiary-fixed text-[10px] font-label font-bold text-tertiary truncate flex items-center gap-1">
<span class="material-symbols-outlined text-[12px]">assignment</span> Mock #1 DBMS
                </div>
<div class="px-2 py-1 rounded bg-surface text-[10px] font-label text-on-surface truncate">
                  50 Questions
                </div>
</div>
<span class="text-[9px] font-label font-bold text-tertiary tracking-wide uppercase">3.0 hrs peak</span>
</div>
<!-- Sat 20 -->
<div class="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all flex flex-col justify-between min-h-[148px] shadow-sm">
<div class="flex items-center justify-between">
<span class="text-[11px] font-label uppercase font-bold text-on-surface-variant">Sat</span>
<span class="text-xs font-headline font-semibold text-on-surface">20</span>
</div>
<div class="flex flex-col gap-1.5 my-2">
<div class="px-2 py-1 rounded bg-surface text-[10px] font-label font-semibold text-on-surface truncate flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim"></span> 35 Cards
                </div>
<div class="px-2 py-1 rounded bg-secondary-container text-[10px] font-label text-on-surface-variant truncate">
                  Cell Transduction
                </div>
</div>
<span class="text-[9px] font-label font-bold text-on-surface-variant tracking-wide uppercase">1.2 hrs rest</span>
</div>
<!-- Sun 21 -->
<div class="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all flex flex-col justify-between min-h-[148px] shadow-sm">
<div class="flex items-center justify-between">
<span class="text-[11px] font-label uppercase font-bold text-on-surface-variant">Sun</span>
<span class="text-xs font-headline font-semibold text-on-surface">21</span>
</div>
<div class="flex flex-col gap-1.5 my-2">
<div class="px-2 py-1 rounded bg-surface text-[10px] font-label font-semibold text-on-surface truncate flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-primary-container"></span> 95 Cards
                </div>
<div class="px-2 py-1 rounded bg-surface text-[10px] font-label text-on-surface truncate">
                  Week Consolidation
                </div>
</div>
<span class="text-[9px] font-label font-bold text-primary tracking-wide uppercase">2.4 hrs</span>
</div>
</div>
</div>
<!-- Exam Milestones Detailed Breakdown -->
<div class="flex flex-col gap-5">
<div class="flex items-center justify-between">
<h2 class="font-headline text-3xl font-medium text-on-surface">Final Exam Targets &amp; Prep Milestones</h2>
<span class="text-xs font-label text-on-surface-variant">Chronological countdown</span>
</div>
<!-- Milestone Card 1: CS-402 DBMS -->
<article class="p-7 rounded-2xl bg-surface-container-low shadow-sm hover:shadow-md transition-all flex flex-col gap-6 relative overflow-hidden">
<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold font-headline text-xl shadow-sm">
                  CS
                </div>
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="font-label text-xs font-bold text-tertiary uppercase tracking-wider">CS-402 • 4.0 Credits</span>
<span class="px-2 py-0.5 rounded text-[10px] font-label font-semibold bg-tertiary text-on-tertiary">Urgent Priority</span>
</div>
<h3 class="font-headline text-2xl font-semibold text-on-surface">Database Management Systems</h3>
</div>
</div>
<!-- Countdown Badge -->
<div class="flex items-center gap-6 self-start md:self-auto">
<div class="flex flex-col items-end">
<span class="font-headline text-3xl font-bold text-tertiary leading-none">9</span>
<span class="text-[11px] font-label text-on-surface-variant uppercase tracking-wider">Days to Final (May 24)</span>
</div>
<div class="w-14 h-14 relative flex items-center justify-center">
<svg class="w-14 h-14 transform -rotate-90" viewbox="0 0 36 36">
<path class="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.5"></path>
<path class="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="72, 100" stroke-linecap="round" stroke-width="3.5"></path>
</svg>
<span class="absolute text-xs font-label font-bold text-on-surface">72%</span>
</div>
</div>
</div>
<!-- Syllabus Sub-Milestones Checklist -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
<div class="p-3.5 rounded-xl bg-surface-container flex items-center justify-between">
<div class="flex items-center gap-2.5">
<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
<span class="text-xs font-label text-on-surface font-medium">Relational Algebra &amp; SQL</span>
</div>
<span class="text-[10px] font-label font-bold text-on-surface-variant">100%</span>
</div>
<div class="p-3.5 rounded-xl bg-surface-container flex items-center justify-between">
<div class="flex items-center gap-2.5">
<span class="material-symbols-outlined text-primary-container text-[18px]">radio_button_checked</span>
<span class="text-xs font-label text-on-surface font-medium">Indexing (B+ Trees &amp; Hashing)</span>
</div>
<span class="text-[10px] font-label font-bold text-primary">68%</span>
</div>
<div class="p-3.5 rounded-xl bg-surface-container flex items-center justify-between">
<div class="flex items-center gap-2.5">
<span class="material-symbols-outlined text-tertiary text-[18px]">pending</span>
<span class="text-xs font-label text-on-surface font-medium">Concurrency &amp; 2PL Recovery</span>
</div>
<span class="text-[10px] font-label font-bold text-tertiary">48%</span>
</div>
</div>
<!-- Milestone CTAs -->
<div class="flex flex-wrap items-center justify-between gap-4 pt-1">
<div class="flex items-center gap-2 text-xs font-label text-on-surface-variant">
<span class="material-symbols-outlined text-[16px] text-tertiary">notification_important</span>
                Next active recall interval trigger: <span class="font-bold text-on-surface">Tomorrow at 09:30 AM</span>
</div>
<div class="flex items-center gap-2">
<button class="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-label font-semibold text-on-surface transition-colors shadow-sm" type="button">
                  View Card Deck (218)
                </button>
<button class="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary hover:opacity-95 text-xs font-label font-semibold transition-colors shadow-sm flex items-center gap-1.5" type="button">
<span class="material-symbols-outlined text-[16px]">play_arrow</span> Launch Mock Test #1
                </button>
</div>
</div>
</article>
<!-- Milestone Card 2: MATH-301 Linear Algebra -->
<article class="p-7 rounded-2xl bg-surface-container-low shadow-sm hover:shadow-md transition-all flex flex-col gap-6">
<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold font-headline text-xl shadow-sm">
                  MA
                </div>
<div class="flex flex-col">
<span class="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider">MATH-301 • 3.5 Credits</span>
<h3 class="font-headline text-2xl font-semibold text-on-surface">Advanced Linear Algebra &amp; SVD</h3>
</div>
</div>
<!-- Countdown Badge -->
<div class="flex items-center gap-6 self-start md:self-auto">
<div class="flex flex-col items-end">
<span class="font-headline text-3xl font-bold text-on-surface leading-none">18</span>
<span class="text-[11px] font-label text-on-surface-variant uppercase tracking-wider">Days to Final (June 02)</span>
</div>
<div class="w-14 h-14 relative flex items-center justify-center">
<svg class="w-14 h-14 transform -rotate-90" viewbox="0 0 36 36">
<path class="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.5"></path>
<path class="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="88, 100" stroke-linecap="round" stroke-width="3.5"></path>
</svg>
<span class="absolute text-xs font-label font-bold text-on-surface">88%</span>
</div>
</div>
</div>
<!-- Sub Milestones -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
<div class="p-3.5 rounded-xl bg-surface-container flex items-center justify-between">
<div class="flex items-center gap-2.5">
<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
<span class="text-xs font-label text-on-surface font-medium">Vector Spaces &amp; Nullity</span>
</div>
<span class="text-[10px] font-label font-bold text-on-surface-variant">100%</span>
</div>
<div class="p-3.5 rounded-xl bg-surface-container flex items-center justify-between">
<div class="flex items-center gap-2.5">
<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
<span class="text-xs font-label text-on-surface font-medium">Spectral Theorem</span>
</div>
<span class="text-[10px] font-label font-bold text-on-surface-variant">92%</span>
</div>
<div class="p-3.5 rounded-xl bg-surface-container flex items-center justify-between">
<div class="flex items-center gap-2.5">
<span class="material-symbols-outlined text-primary-container text-[18px]">radio_button_checked</span>
<span class="text-xs font-label text-on-surface font-medium">Singular Value Decomp.</span>
</div>
<span class="text-[10px] font-label font-bold text-primary">74%</span>
</div>
</div>
<div class="flex flex-wrap items-center justify-between gap-4 pt-1">
<span class="text-xs font-label text-on-surface-variant">Retention decay forecast: Steady (Half-life: 14 days)</span>
<div class="flex items-center gap-2">
<button class="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-label font-semibold text-on-surface transition-colors shadow-sm" type="button">
                  View Card Deck (176)
                </button>
<button class="px-3.5 py-1.5 rounded-lg bg-secondary-container hover:bg-surface-container-high text-xs font-label font-semibold text-on-surface transition-colors shadow-sm" type="button">
                  Mock Scheduled (May 27)
                </button>
</div>
</div>
</article>
<!-- Milestone Card 3: BIO-210 Cell Biology -->
<article class="p-7 rounded-2xl bg-surface-container-low shadow-sm hover:shadow-md transition-all flex flex-col gap-6">
<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center font-bold font-headline text-xl shadow-sm">
                  BIO
                </div>
<div class="flex flex-col">
<span class="font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider">BIO-210 • 4.0 Credits</span>
<h3 class="font-headline text-2xl font-semibold text-on-surface">Molecular Cell Biology &amp; Signaling</h3>
</div>
</div>
<!-- Countdown Badge -->
<div class="flex items-center gap-6 self-start md:self-auto">
<div class="flex flex-col items-end">
<span class="font-headline text-3xl font-bold text-on-surface leading-none">27</span>
<span class="text-[11px] font-label text-on-surface-variant uppercase tracking-wider">Days to Final (June 11)</span>
</div>
<div class="w-14 h-14 relative flex items-center justify-center">
<svg class="w-14 h-14 transform -rotate-90" viewbox="0 0 36 36">
<path class="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.5"></path>
<path class="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="93, 100" stroke-linecap="round" stroke-width="3.5"></path>
</svg>
<span class="absolute text-xs font-label font-bold text-on-surface">93%</span>
</div>
</div>
</div>
<!-- Sub Milestones -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
<div class="p-3.5 rounded-xl bg-surface-container flex items-center justify-between">
<div class="flex items-center gap-2.5">
<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
<span class="text-xs font-label text-on-surface font-medium">Receptor Kinases &amp; GPCR</span>
</div>
<span class="text-[10px] font-label font-bold text-on-surface-variant">96%</span>
</div>
<div class="p-3.5 rounded-xl bg-surface-container flex items-center justify-between">
<div class="flex items-center gap-2.5">
<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
<span class="text-xs font-label text-on-surface font-medium">Mitochondrial Bioenergetics</span>
</div>
<span class="text-[10px] font-label font-bold text-on-surface-variant">94%</span>
</div>
<div class="p-3.5 rounded-xl bg-surface-container flex items-center justify-between">
<div class="flex items-center gap-2.5">
<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
<span class="text-xs font-label text-on-surface font-medium">Cell Cycle &amp; Apoptosis</span>
</div>
<span class="text-[10px] font-label font-bold text-on-surface-variant">88%</span>
</div>
</div>
<div class="flex flex-wrap items-center justify-between gap-4 pt-1">
<span class="text-xs font-label text-on-surface-variant">Maintenance pace: 15 recall cards every 48 hours</span>
<div class="flex items-center gap-2">
<button class="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-label font-semibold text-on-surface transition-colors shadow-sm" type="button">
                  View Card Deck (310)
                </button>
</div>
</div>
</article>
</div>
</section>
<!-- RIGHT COLUMN (35% ~ 4 cols) -->
<aside class="lg:col-span-4 flex flex-col gap-8">
<!-- Tantra AI Workload Balancer Card -->
<div class="p-7 rounded-2xl bg-surface-container-low shadow-sm flex flex-col gap-6 relative overflow-hidden">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shadow-sm">
<span class="material-symbols-outlined text-[20px]">psychology</span>
</div>
<div>
<h3 class="font-headline text-xl font-semibold text-on-surface">Tantra Workload AI</h3>
<span class="text-[10px] font-label uppercase tracking-wider text-on-surface-variant font-bold">Cognitive Fatigue Protection</span>
</div>
</div>
<span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
</div>
<p class="font-body text-xs text-on-surface-variant leading-relaxed">
            Neural retention modeling has shifted 20 minutes from Mathematics to CS-402 DBMS today to stabilize the fast-decaying B+ Tree query algorithms.
          </p>
<!-- Day Time Allocation Breakdown -->
<div class="flex flex-col gap-3">
<div class="flex justify-between items-center text-xs font-label">
<span class="text-on-surface font-semibold">Today's Optimal Study Allocation</span>
<span class="font-bold text-primary">2h 30m Total</span>
</div>
<!-- Segmented Progress Bar -->
<div class="w-full h-3 rounded-full bg-surface-container flex overflow-hidden p-0.5 gap-0.5">
<div class="bg-primary h-full rounded-l-full transition-all" style="width: 55%;" title="CS-402 (80m)"></div>
<div class="bg-primary-container h-full transition-all" style="width: 28%;" title="MATH-301 (45m)"></div>
<div class="bg-outline h-full rounded-r-full transition-all" style="width: 17%;" title="BIO-210 (25m)"></div>
</div>
<!-- Legend Details -->
<div class="flex flex-col gap-2 mt-2">
<div class="flex items-center justify-between text-xs font-label">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-sm bg-primary"></span>
<span class="text-on-surface font-medium">CS-402 DBMS</span>
</div>
<span class="font-bold text-on-surface">1h 20m</span>
</div>
<div class="flex items-center justify-between text-xs font-label">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-sm bg-primary-container"></span>
<span class="text-on-surface font-medium">MATH-301 Linear Alg</span>
</div>
<span class="font-bold text-on-surface">45m</span>
</div>
<div class="flex items-center justify-between text-xs font-label">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-sm bg-outline"></span>
<span class="text-on-surface font-medium">BIO-210 Cell Bio</span>
</div>
<span class="font-bold text-on-surface">25m</span>
</div>
</div>
</div>
<!-- Micro Insight Quote -->
<div class="p-3.5 rounded-xl bg-surface flex items-start gap-3">
<span class="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">tips_and_updates</span>
<p class="text-[11px] font-body text-on-surface leading-snug">
              Spacing factor adjusted to <strong class="text-primary font-semibold">2.4x</strong>. Retention probability for your weakest 15 concepts increased by 19% after Sunday's interval.
            </p>
</div>
</div>
<!-- Syllabus Topic Readiness Matrix -->
<div class="p-7 rounded-2xl bg-surface-container-low shadow-sm flex flex-col gap-6">
<div class="flex items-center justify-between">
<h3 class="font-headline text-xl font-semibold text-on-surface">Topic Mastery Matrix</h3>
<span class="text-[11px] font-label font-bold text-primary uppercase">Chapter Depth</span>
</div>
<div class="flex flex-col gap-4">
<!-- Item 1 -->
<div class="flex flex-col gap-1.5">
<div class="flex justify-between items-baseline text-xs font-label">
<span class="font-semibold text-on-surface">Relational Normalization (3NF/BCNF)</span>
<span class="text-xs font-bold text-primary">94%</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 94%"></div>
</div>
<span class="text-[10px] font-label text-on-surface-variant">Mastery status: Permanent Storage</span>
</div>
<!-- Item 2 -->
<div class="flex flex-col gap-1.5">
<div class="flex justify-between items-baseline text-xs font-label">
<span class="font-semibold text-on-surface">Concurreny Control (Timestamping)</span>
<span class="text-xs font-bold text-tertiary">52%</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-tertiary h-full rounded-full" style="width: 52%"></div>
</div>
<span class="text-[10px] font-label text-tertiary font-medium">Critical: High error rate in last review session</span>
</div>
<!-- Item 3 -->
<div class="flex flex-col gap-1.5">
<div class="flex justify-between items-baseline text-xs font-label">
<span class="font-semibold text-on-surface">SVD &amp; Principal Component Analysis</span>
<span class="text-xs font-bold text-primary-container">76%</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-primary-container h-full rounded-full" style="width: 76%"></div>
</div>
<span class="text-[10px] font-label text-on-surface-variant">Next review scheduled in 48 hours</span>
</div>
<!-- Item 4 -->
<div class="flex flex-col gap-1.5">
<div class="flex justify-between items-baseline text-xs font-label">
<span class="font-semibold text-on-surface">Signaling: Tyrosine Kinase Pathways</span>
<span class="text-xs font-bold text-primary">91%</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 91%"></div>
</div>
<span class="text-[10px] font-label text-on-surface-variant">Mastery status: Long-term Consolidated</span>
</div>
<!-- Item 5 -->
<div class="flex flex-col gap-1.5">
<div class="flex justify-between items-baseline text-xs font-label">
<span class="font-semibold text-on-surface">Gram-Schmidt Orthogonalization</span>
<span class="text-xs font-bold text-primary">82%</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 82%"></div>
</div>
<span class="text-[10px] font-label text-on-surface-variant">3 recall rounds successfully completed</span>
</div>
</div>
</div>
<!-- Primary CTA Card -->
<div class="p-7 rounded-2xl bg-surface-container-high shadow-md flex flex-col gap-4 text-center items-center justify-center relative overflow-hidden">
<div class="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center shadow-sm">
<span class="material-symbols-outlined text-[24px]">model_training</span>
</div>
<div class="flex flex-col gap-1">
<h4 class="font-headline text-2xl font-semibold text-on-surface">Reschedule Spaced Intervals?</h4>
<p class="font-body text-xs text-on-surface-variant max-w-xs">
              Recalculates optimum review times based on sleep schedule, exam dates, and current syllabus readiness.
            </p>
</div>
<button class="w-full mt-2 py-3 px-5 rounded-lg bg-primary text-on-primary hover:opacity-95 font-label text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 group" id="generate-schedule-btn" type="button">
<span class="material-symbols-outlined text-[18px] group-hover:rotate-180 transition-transform duration-500">sync</span>
            Generate Custom Spaced Schedule
          </button>
<span class="text-[10px] font-label text-on-surface-variant">Last recalculated: 4 hours ago</span>
</div>
</aside>
</div>
</div>
</div>
<script>
  // Simple micro-interaction for custom schedule generation CTA
  document.getElementById('generate-schedule-btn')?.addEventListener('click', function() {
    const btn = this;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Optimizing Intervals...`;
    btn.classList.add('opacity-80', 'pointer-events-none');

    setTimeout(() => {
      btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">done</span> Schedule Re-Optimized!`;
      btn.classList.remove('opacity-80');
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('pointer-events-none');
      }, 2500);
    }, 1200);
  });
</script></main></div></body></html>

<!-- StudyTantra - Document Library & Upload (Sahara Edition) -->
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;family=Manrope:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "tertiary": "#8c3c3c", "on-surface": "#3a302a", "error": "#c0392b", "surface": "#faf5ee", "secondary-fixed": "#eae2da", "on-tertiary": "#ffffff", "on-background": "#3a302a", "outline": "#9a9088", "tertiary-container": "#d47070", "primary-fixed-dim": "#f0a878", "surface-bright": "#faf5ee", "surface-variant": "#ece6dc", "tertiary-fixed-dim": "#e8a0a0", "on-secondary": "#ffffff", "secondary-fixed-dim": "#cec6be", "surface-container-low": "#f6f0e8", "primary-container": "#e08850", "surface-dim": "#dcd6cc", "primary-fixed": "#fbe8d8", "on-error": "#ffffff", "surface-container": "#f2ece4", "on-tertiary-fixed-variant": "#6e3030", "surface-container-lowest": "#ffffff", "on-primary-container": "#fbe8d8", "secondary": "#78706a", "surface-container-highest": "#e6e0d6", "outline-variant": "#d8d0c8", "secondary-container": "#eae2da", "on-primary-fixed": "#401a08", "error-container": "#fce4e0", "on-secondary-fixed-variant": "#504840", "on-tertiary-container": "#3a2020", "inverse-primary": "#f0a878", "inverse-surface": "#3a302a", "on-tertiary-fixed": "#2e1515", "tertiary-fixed": "#fce0e0", "on-primary-fixed-variant": "#8a4518", "on-primary": "#ffffff", "surface-container-high": "#ece6dc", "background": "#faf5ee", "on-secondary-fixed": "#2a2420", "on-secondary-container": "#605850", "surface-tint": "#c2652a", "primary": "#c2652a", "on-error-container": "#7a1a10", "inverse-on-surface": "#faf5ee", "on-surface-variant": "#605850" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": {}, "fontFamily": { "headline": [ "EB Garamond" ], "display": [ "EB Garamond" ], "body": [ "Manrope" ], "label": [ "Manrope" ] }, "fontSize": {} } } }</script></head><body class="bg-surface font-body text-on-surface antialiased"><aside class="fixed left-0 top-0 h-screen w-72 bg-surface-container-low shadow-[0_2px_16px_rgba(58,48,42,0.04)] z-50 flex flex-col justify-between py-6 px-5 border-r border-outline-variant/30"><div class="flex flex-col"><div class="px-3 pb-6 flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm"><span class="material-symbols-outlined text-2xl">local_fire_department</span></div><div class="flex flex-col"><span class="font-headline text-2xl font-bold tracking-tight text-on-surface leading-none">StudyTantra</span><span class="text-[11px] font-label font-medium tracking-wide uppercase text-on-surface-variant mt-1">AI Spaced Recall</span></div></div><nav class="flex flex-col gap-1 mt-1" data-active-classes="bg-primary text-on-primary font-semibold shadow-sm"><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="dashboard" href="#">Dashboard</a><a aria-current="page" class="flex items-center px-3.5 py-2.5 rounded-lg transition-colors bg-primary text-on-primary font-semibold shadow-sm" data-path="document-library" href="#">Document Library</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="flashcards-vault" href="#">Flashcards Vault</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="spaced-review" href="#">Spaced Review</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="exam-planner" href="#">Exam Planner</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="quiz-engine" href="#">Quiz Engine</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="collection-workspace" href="#">Collection Workspace</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="settings-preferences" href="#">Settings &amp; Preferences</a></nav></div><div class="flex flex-col gap-4 px-1"><div class="p-4 rounded-xl bg-surface-container flex items-center justify-between shadow-[0_2px_16px_rgba(58,48,42,0.04)]"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[20px]">flare</span></div><div class="flex flex-col"><span class="text-[11px] font-label font-medium uppercase text-on-surface-variant">Mindful Habit</span><span class="text-xs font-semibold text-on-surface">14 Days Streak</span></div></div><span class="text-xs font-bold text-primary font-label bg-surface px-2 py-1 rounded-md">Lv. 4</span></div><div class="flex items-center justify-between pt-2 border-t border-outline-variant/40"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div><div class="flex flex-col"><span class="text-xs font-semibold text-on-surface leading-snug">Arya Sharma</span><span class="text-[10px] text-on-surface-variant">Scholar Plan</span></div></div><button aria-label="Account switcher" class="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">unfold_more</span></button></div></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(58,48,42,0.04)]"><div class="h-16 w-full px-8 flex items-center justify-between gap-6"><div class="flex-1 max-w-xl"><div class="relative flex items-center"><span class="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">search</span><input class="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="Search concepts, textbooks, notes, formulas..." type="text"/></div></div><div class="flex items-center gap-3.5"><div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface"><span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span><span class="font-label font-medium text-[11px] text-on-surface-variant">Active Deck:</span><span class="font-semibold text-primary text-[11px]">Cognitive Neuroscience</span></div><button aria-label="Notifications" class="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary"></span></button><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="relative pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<div class="p-8 lg:p-12 max-w-7xl mx-auto w-full flex flex-col gap-10">
<!-- Header Section -->
<header class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
<div class="flex flex-col gap-2 max-w-2xl">
<div class="flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span class="text-[11px] font-label font-bold tracking-widest uppercase text-primary">Knowledge Synthesis Engine</span>
</div>
<h1 class="font-headline text-4xl lg:text-5xl font-medium tracking-tight text-on-surface leading-[1.1]">
          Document Library &amp; AI Ingestion Hub
        </h1>
<p class="font-body text-sm text-on-surface-variant leading-relaxed mt-1">
          Upload syllabi, lecture decks, and research papers to synthesize high-yield active-recall flashcard vaults with LaTeX formula preservation.
        </p>
</div>
<div class="flex items-center gap-3 self-start md:self-auto">
<button class="px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-container-highest transition-all flex items-center gap-2 shadow-sm" id="quick-sync-btn">
<span class="material-symbols-outlined text-[18px] text-on-surface-variant">sync</span>
          Sync LMS Feeds
        </button>
<button class="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-semibold tracking-wide hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm hover:shadow-md" id="open-upload-modal">
<span class="material-symbols-outlined text-[18px]">add</span>
          + Upload Academic Source
        </button>
</div>
</header>
<!-- Primary Ingestion Hero Card (Dropzone & Processing Hub) -->
<section class="rounded-2xl bg-surface-container-low p-6 lg:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] relative overflow-hidden">
<div class="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
<!-- Interactive Dropzone -->
<div class="lg:col-span-8 group relative rounded-xl bg-surface-container-lowest p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.005]" id="drop-zone">
<div class="w-16 h-16 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary mb-4 transition-transform group-hover:-translate-y-1">
<span class="material-symbols-outlined text-3xl">cloud_upload</span>
</div>
<h3 class="font-headline text-2xl font-semibold text-on-surface tracking-tight mb-1">
            Drop lecture slides, textbooks, or scanned manuscripts here
          </h3>
<p class="text-xs text-on-surface-variant max-w-md mb-6 leading-relaxed">
            Automatic structure detection, equation parsing via OCR, and spaced-retention deck generation.
          </p>
<div class="flex flex-wrap items-center justify-center gap-3 mb-6">
<span class="px-3 py-1 rounded-md bg-surface-container text-[11px] font-semibold text-on-surface flex items-center gap-1.5">
<span class="material-symbols-outlined text-tertiary text-sm">picture_as_pdf</span> PDF Decks
            </span>
<span class="px-3 py-1 rounded-md bg-surface-container text-[11px] font-semibold text-on-surface flex items-center gap-1.5">
<span class="material-symbols-outlined text-primary text-sm">slideshow</span> PPTX Decks
            </span>
<span class="px-3 py-1 rounded-md bg-surface-container text-[11px] font-semibold text-on-surface flex items-center gap-1.5">
<span class="material-symbols-outlined text-secondary text-sm">description</span> DOCX &amp; MD
            </span>
<span class="px-3 py-1 rounded-md bg-surface-container text-[11px] font-semibold text-on-surface flex items-center gap-1.5">
<span class="material-symbols-outlined text-primary text-sm">auto_stories</span> EPUB
            </span>
</div>
<div class="flex items-center gap-4">
<button class="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-semibold shadow-sm hover:bg-primary-container transition-colors">
              Browse Local Storage
            </button>
<span class="text-xs text-on-surface-variant font-medium">or import directly via:</span>
</div>
<div class="flex items-center gap-2 mt-4 text-xs font-semibold text-on-surface-variant">
<button class="hover:text-primary transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-sm">school</span> Canvas LMS
            </button>
<span>•</span>
<button class="hover:text-primary transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-sm">folder</span> Google Drive
            </button>
<span>•</span>
<button class="hover:text-primary transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-sm">link</span> Web arXiv / URL
            </button>
</div>
</div>
<!-- Engine Status & OCR Meta Column -->
<div class="lg:col-span-4 flex flex-col justify-between gap-4 bg-surface-container rounded-xl p-6">
<div class="flex flex-col gap-4">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
<span class="text-xs font-bold uppercase tracking-wider text-on-surface">Synthesis Pipeline</span>
</div>
<span class="px-2 py-0.5 rounded bg-primary-fixed text-primary font-bold text-[10px]">v4.2 PRO</span>
</div>
<div class="p-3.5 rounded-lg bg-surface-container-lowest shadow-sm flex flex-col gap-1.5">
<div class="flex items-center justify-between text-xs font-semibold text-on-surface">
<span class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-primary">functions</span>
                  LaTeX &amp; Proof Extractor
                </span>
<span class="text-emerald-700 font-bold">Optimal</span>
</div>
<p class="text-[11px] text-on-surface-variant leading-snug">
                Detects embedded matrices, tensors, and Greek notation in inline diagrams.
              </p>
</div>
<div class="p-3.5 rounded-lg bg-surface-container-lowest shadow-sm flex flex-col gap-1.5">
<div class="flex items-center justify-between text-xs font-semibold text-on-surface">
<span class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-primary">draw</span>
                  Handwriting OCR
                </span>
<span class="text-emerald-700 font-bold">99.4% Accuracy</span>
</div>
<p class="text-[11px] text-on-surface-variant leading-snug">
                Trained on STEM college notebooks, tablet styluses, and loose-leaf margins.
              </p>
</div>
</div>
<div class="pt-4 flex items-center justify-between text-[11px] text-on-surface-variant">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-xs">memory</span> GPU Engine: H100 Node 04
            </span>
<span class="font-semibold text-primary">Latency: 280ms/pg</span>
</div>
</div>
</div>
</section>
<!-- Live Ingestion & Processing Queue Strip -->
<section class="flex flex-col gap-3">
<div class="flex items-center justify-between">
<h2 class="font-headline text-xl font-bold tracking-tight text-on-surface flex items-center gap-2">
<span>Active Ingestion Queue</span>
<span class="text-xs font-body font-semibold px-2 py-0.5 rounded-full bg-primary-fixed text-primary">2 Active Tasks</span>
</h2>
<button class="text-xs text-primary font-semibold hover:underline">View Pipeline Logs</button>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<!-- Item 1: Completed -->
<div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
<div class="flex items-start justify-between gap-3">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">check_circle</span>
</div>
<div class="flex flex-col">
<span class="text-xs font-bold text-on-surface truncate max-w-xs md:max-w-sm">
                  Silberschatz_Database_Systems_Ch19.pdf
                </span>
<span class="text-[11px] text-on-surface-variant font-medium">CS-402 DBMS • 52 Pages</span>
</div>
</div>
<span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Ready</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div class="bg-emerald-600 h-full w-full rounded-full transition-all duration-500"></div>
</div>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant">
<span>100% Parsed • 42 Flashcards Synthesized</span>
<button class="text-primary font-semibold hover:underline">Inspect Vault</button>
</div>
</div>
<!-- Item 2: In-flight with dynamic progress -->
<div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
<div class="flex items-start justify-between gap-3">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
<span class="material-symbols-outlined text-[18px] animate-spin">sync</span>
</div>
<div class="flex flex-col">
<span class="text-xs font-bold text-on-surface truncate max-w-xs md:max-w-sm">
                  Strang_Linear_Algebra_Eigenvalues.pdf
                </span>
<span class="text-[11px] text-on-surface-variant font-medium">MATH-301 • Page 184 of 320</span>
</div>
</div>
<span class="text-[11px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">Synthesizing</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div class="bg-primary h-full w-[68%] rounded-full transition-all duration-500"></div>
</div>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant">
<span>Processing page 184/320 • Extracting Proofs 68%</span>
<span class="font-medium text-secondary">ETA 34s</span>
</div>
</div>
</div>
</section>
<!-- Filter & Action Controls -->
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4">
<!-- Search Input -->
<div class="relative w-full lg:w-96">
<span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">search</span>
<input class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-sm" id="doc-search" placeholder="Filter by title, theorem, professor, or tag..." type="text"/>
</div>
<!-- Filter Chips -->
<div class="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
<button class="filter-chip px-3.5 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold shadow-sm whitespace-nowrap" data-filter="all">
          All Documents (28)
        </button>
<button class="filter-chip px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface text-xs font-medium whitespace-nowrap transition-colors" data-filter="cs-402">
          CS-402 DBMS
        </button>
<button class="filter-chip px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface text-xs font-medium whitespace-nowrap transition-colors" data-filter="math-301">
          MATH-301 Linear Algebra
        </button>
<button class="filter-chip px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface text-xs font-medium whitespace-nowrap transition-colors" data-filter="bio-210">
          BIO-210 Cell Bio
        </button>
<button class="filter-chip px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1" data-filter="favorites">
<span class="material-symbols-outlined text-[14px] text-tertiary">star</span>
          Favorites (6)
        </button>
</div>
</div>
<!-- 3-Column Document Cards Grid -->
<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<!-- Card 1 -->
<article class="doc-card group rounded-2xl bg-surface-container-lowest p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5" data-category="cs-402">
<div class="flex flex-col gap-4">
<div class="flex items-start justify-between gap-3">
<span class="px-2.5 py-1 rounded-md bg-primary-fixed text-primary text-[11px] font-bold tracking-wide uppercase">
              CS-402 DBMS
            </span>
<button class="text-outline hover:text-tertiary transition-colors" title="Bookmark">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
</button>
</div>
<div class="flex gap-4">
<div class="w-16 h-20 rounded-lg bg-surface-container flex-shrink-0 flex items-center justify-center text-primary-container overflow-hidden shadow-inner relative">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Editorial book cover of database systems textbook resting on a linen cloth surface in warm morning golden light with warm terracotta and beige tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_sYWgn_54KA085tTmWjpEwtaNKuOdYcW3e785wq8qZsa5eYfy9G1LArlJLVX7JymhCQcSxznqMdcxSySdjetUev4zCR2zDcCxGbnSUSbToqdkLTyvqTo2t-EYmm_kp9LGVMAE0TTTqBX7ki02hZJOoAkybEqdE7QxqnO4V2SNs2VvQINSf7UJCrzDYCqj1RwGK1U5HCLql9cEpkiykHmVnLZQIJLc9ZbTnA9jLAmu"/>
<span class="material-symbols-outlined absolute inset-0 m-auto text-on-surface/40 flex items-center justify-center">menu_book</span>
</div>
<div class="flex flex-col">
<h3 class="font-headline text-lg font-bold text-on-surface leading-tight line-clamp-2">
                Silberschatz Database System Concepts (7th Ed.)
              </h3>
<span class="text-xs text-on-surface-variant mt-1">Avi Silberschatz, Henry Korth</span>
<span class="text-[11px] text-outline mt-0.5">984 pages • 142 Flashcards</span>
</div>
</div>
<div class="p-3 rounded-xl bg-surface-container-low flex items-center justify-between text-xs mt-2">
<div class="flex flex-col">
<span class="text-[10px] uppercase font-bold text-on-surface-variant">Retention Score</span>
<span class="font-bold text-on-surface text-sm">89%</span>
</div>
<div class="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
<span class="w-2 h-2 rounded-full bg-emerald-600"></span>
              Strong Recall
            </div>
<div class="flex flex-col text-right">
<span class="text-[10px] uppercase font-bold text-on-surface-variant">Last Recalled</span>
<span class="text-on-surface font-medium text-[11px]">2h ago</span>
</div>
</div>
</div>
<div class="flex items-center justify-between pt-5 mt-4 border-t border-surface-container gap-2">
<button class="flex-1 py-2 px-3 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors text-center">
            Open Reader
          </button>
<button class="flex-1 py-2 px-3 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors text-center shadow-sm">
            Study Deck
          </button>
<button class="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors" title="Export &amp; Settings">
<span class="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</article>
<!-- Card 2 -->
<article class="doc-card group rounded-2xl bg-surface-container-lowest p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5" data-category="math-301">
<div class="flex flex-col gap-4">
<div class="flex items-start justify-between gap-3">
<span class="px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold tracking-wide uppercase">
              MATH-301 Linear Alg
            </span>
<button class="text-outline hover:text-tertiary transition-colors" title="Bookmark">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
</button>
</div>
<div class="flex gap-4">
<div class="w-16 h-20 rounded-lg bg-surface-container flex-shrink-0 flex items-center justify-center text-primary-container overflow-hidden shadow-inner relative">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Modern minimalist textbook cover of linear algebra with geometric vectors and warm earthy beige and brown background lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoO3EsdtzW78_yik6HpY2KoY0RmbqhF5q20AjicdxZUIW8TW_Mw5Q7NDbUDrQE6LgKdFlLybsOkkvwaqslJCv9tLqFrHkCJP0E8FkptrQO4uHhp3iKOW-2eewfyj48qYvR9zjalPxQ93F9nixwOsVD418QGZn0BDU0Ienv8j64tSsqt9BZ8MrogvTXNOTWDc5Rcw9d9Ni3xkv5MvGgi6tJkzISrnQM2LL2ma9hxSRR"/>
<span class="material-symbols-outlined absolute inset-0 m-auto text-on-surface/40 flex items-center justify-center">calculate</span>
</div>
<div class="flex flex-col">
<h3 class="font-headline text-lg font-bold text-on-surface leading-tight line-clamp-2">
                Gilbert Strang — Introduction to Linear Algebra (5th Ed.)
              </h3>
<span class="text-xs text-on-surface-variant mt-1">Wellesley-Cambridge Press</span>
<span class="text-[11px] text-outline mt-0.5">584 pages • 88 Flashcards</span>
</div>
</div>
<div class="p-3 rounded-xl bg-surface-container-low flex items-center justify-between text-xs mt-2">
<div class="flex flex-col">
<span class="text-[10px] uppercase font-bold text-on-surface-variant">Retention Score</span>
<span class="font-bold text-on-surface text-sm">92%</span>
</div>
<div class="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
<span class="w-2 h-2 rounded-full bg-emerald-600"></span>
              Peak Recall
            </div>
<div class="flex flex-col text-right">
<span class="text-[10px] uppercase font-bold text-on-surface-variant">Last Recalled</span>
<span class="text-on-surface font-medium text-[11px]">Yesterday</span>
</div>
</div>
</div>
<div class="flex items-center justify-between pt-5 mt-4 border-t border-surface-container gap-2">
<button class="flex-1 py-2 px-3 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors text-center">
            Open Reader
          </button>
<button class="flex-1 py-2 px-3 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors text-center shadow-sm">
            Study Deck
          </button>
<button class="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors" title="Export &amp; Settings">
<span class="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</article>
<!-- Card 3 -->
<article class="doc-card group rounded-2xl bg-surface-container-lowest p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5" data-category="bio-210">
<div class="flex flex-col gap-4">
<div class="flex items-start justify-between gap-3">
<span class="px-2.5 py-1 rounded-md bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold tracking-wide uppercase">
              BIO-210 Cell Bio
            </span>
<button class="text-outline hover:text-tertiary transition-colors" title="Bookmark">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
</button>
</div>
<div class="flex gap-4">
<div class="w-16 h-20 rounded-lg bg-surface-container flex-shrink-0 flex items-center justify-center text-primary-container overflow-hidden shadow-inner relative">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Microscopic biology textbook front cover with detailed cell membranes in warm sepia and soft amber aesthetic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXR8RlDJ-td1rp5QSbr3UDA9DezORcTYHU12TZBRID46IcSYCPuT-ZRAX9_fo3ukn43oVJ3l_304MjgC2NS8wOLXiLIxAEwl5yjjEAwTtBftHESTxT5wWRHma5Xp2xqLkXR9Z2Ibpmz2gsl1gPydoxnDnUmQMNfHK2fjqbLgGSjABwgHHXNmVMxDxWRaZCAb-Xmp7X4BtCWSItQrIABgtuI98gIAH2wUTj6f3MhOrB"/>
<span class="material-symbols-outlined absolute inset-0 m-auto text-on-surface/40 flex items-center justify-center">biotech</span>
</div>
<div class="flex flex-col">
<h3 class="font-headline text-lg font-bold text-on-surface leading-tight line-clamp-2">
                Alberts et al. — Molecular Biology of the Cell (6th Ed.)
              </h3>
<span class="text-xs text-on-surface-variant mt-1">Bruce Alberts, Alexander Johnson</span>
<span class="text-[11px] text-outline mt-0.5">1,464 pages • 210 Flashcards</span>
</div>
</div>
<div class="p-3 rounded-xl bg-surface-container-low flex items-center justify-between text-xs mt-2">
<div class="flex flex-col">
<span class="text-[10px] uppercase font-bold text-on-surface-variant">Retention Score</span>
<span class="font-bold text-on-surface text-sm">74%</span>
</div>
<div class="flex items-center gap-1.5 text-amber-700 font-semibold text-[11px]">
<span class="w-2 h-2 rounded-full bg-amber-600"></span>
              Review Due
            </div>
<div class="flex flex-col text-right">
<span class="text-[10px] uppercase font-bold text-on-surface-variant">Last Recalled</span>
<span class="text-on-surface font-medium text-[11px]">3 days ago</span>
</div>
</div>
</div>
<div class="flex items-center justify-between pt-5 mt-4 border-t border-surface-container gap-2">
<button class="flex-1 py-2 px-3 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors text-center">
            Open Reader
          </button>
<button class="flex-1 py-2 px-3 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors text-center shadow-sm">
            Study Deck
          </button>
<button class="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors" title="Export &amp; Settings">
<span class="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</article>
<!-- Card 4 -->
<article class="doc-card group rounded-2xl bg-surface-container-lowest p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5" data-category="cs-402">
<div class="flex flex-col gap-4">
<div class="flex items-start justify-between gap-3">
<span class="px-2.5 py-1 rounded-md bg-primary-fixed text-primary text-[11px] font-bold tracking-wide uppercase">
              CS-402 Slides
            </span>
<button class="text-outline hover:text-tertiary transition-colors" title="Bookmark">
<span class="material-symbols-outlined text-[20px]">star</span>
</button>
</div>
<div class="flex gap-4">
<div class="w-16 h-20 rounded-lg bg-primary-fixed/40 flex-shrink-0 flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-2xl">slideshow</span>
</div>
<div class="flex flex-col">
<h3 class="font-headline text-lg font-bold text-on-surface leading-tight line-clamp-2">
                Stanford Deck 08: OCC &amp; Multi-Version CC
              </h3>
<span class="text-xs text-on-surface-variant mt-1">Prof. Andy Pavlo Guest Lecture</span>
<span class="text-[11px] text-outline mt-0.5">48 slides • 24 Flashcards</span>
</div>
</div>
<div class="p-3 rounded-xl bg-surface-container-low flex items-center justify-between text-xs mt-2">
<div class="flex flex-col">
<span class="text-[10px] uppercase font-bold text-on-surface-variant">Synthesized</span>
<span class="font-bold text-on-surface text-sm">24 Cards</span>
</div>
<div class="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
<span class="material-symbols-outlined text-sm">psychology</span>
              Auto-Spaced
            </div>
<div class="flex flex-col text-right">
<span class="text-[10px] uppercase font-bold text-on-surface-variant">Last Recalled</span>
<span class="text-on-surface font-medium text-[11px]">Today</span>
</div>
</div>
</div>
<div class="flex items-center justify-between pt-5 mt-4 border-t border-surface-container gap-2">
<button class="flex-1 py-2 px-3 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors text-center">
            Open Deck
          </button>
<button class="flex-1 py-2 px-3 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors text-center shadow-sm">
            Study Deck
          </button>
<button class="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</article>
<!-- Card 5 -->
<article class="doc-card group rounded-2xl bg-surface-container-lowest p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5" data-category="math-301">
<div class="flex flex-col gap-4">
<div class="flex items-start justify-between gap-3">
<span class="px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold tracking-wide uppercase">
              MATH-301 Notes
            </span>
<button class="text-outline hover:text-tertiary transition-colors" title="Bookmark">
<span class="material-symbols-outlined text-[20px]">star</span>
</button>
</div>
<div class="flex gap-4">
<div class="w-16 h-20 rounded-lg bg-secondary-fixed/50 flex-shrink-0 flex items-center justify-center text-on-secondary-fixed">
<span class="material-symbols-outlined text-2xl">stylus_note</span>
</div>
<div class="flex flex-col">
<h3 class="font-headline text-lg font-bold text-on-surface leading-tight line-clamp-2">
                MIT 18.06 SVD &amp; Principal Component Analysis
              </h3>
<span class="text-xs text-on-surface-variant mt-1">Handwritten Tablet Notes (Parsed)</span>
<span class="text-[11px] text-outline mt-0.5">18 pages • 16 Flashcards</span>
</div>
</div>
<div class="p-3 rounded-xl bg-surface-container-low flex items-center justify-between text-xs mt-2">
<div class="flex flex-col">
<span class="text-[10px] uppercase font-bold text-on-surface-variant">OCR Proofs</span>
<span class="font-bold text-on-surface text-sm">98.8%</span>
</div>
<div class="flex items-center gap-1.5 text-primary font-semibold text-[11px]">
<span class="material-symbols-outlined text-sm">functions</span>
              14 Formulas
            </div>
<div class="flex flex-col text-right">
<span class="text-[10px] uppercase font-bold text-on-surface-variant">Last Recalled</span>
<span class="text-on-surface font-medium text-[11px]">4 days ago</span>
</div>
</div>
</div>
<div class="flex items-center justify-between pt-5 mt-4 border-t border-surface-container gap-2">
<button class="flex-1 py-2 px-3 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors text-center">
            View Transcripts
          </button>
<button class="flex-1 py-2 px-3 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors text-center shadow-sm">
            Study Deck
          </button>
<button class="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</article>
<!-- Card 6 -->
<article class="doc-card group rounded-2xl bg-surface-container-lowest p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5" data-category="bio-210">
<div class="flex flex-col gap-4">
<div class="flex items-start justify-between gap-3">
<span class="px-2.5 py-1 rounded-md bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold tracking-wide uppercase">
              BIO-210 Manual
            </span>
<button class="text-outline hover:text-tertiary transition-colors" title="Bookmark">
<span class="material-symbols-outlined text-[20px]">star</span>
</button>
</div>
<div class="flex gap-4">
<div class="w-16 h-20 rounded-lg bg-tertiary-fixed/50 flex-shrink-0 flex items-center justify-center text-on-tertiary-fixed">
<span class="material-symbols-outlined text-2xl">science</span>
</div>
<div class="flex flex-col">
<h3 class="font-headline text-lg font-bold text-on-surface leading-tight line-clamp-2">
                Cell Signaling Pathways: GPCR Lab Manual
              </h3>
<span class="text-xs text-on-surface-variant mt-1">Department Protocol Spring Term</span>
<span class="text-[11px] text-outline mt-0.5">32 pages • 19 Flashcards</span>
</div>
</div>
<div class="p-3 rounded-xl bg-surface-container-low flex items-center justify-between text-xs mt-2">
<div class="flex flex-col">
<span class="text-[10px] uppercase font-bold text-on-surface-variant">Synthesized</span>
<span class="font-bold text-on-surface text-sm">19 Cards</span>
</div>
<div class="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
<span class="material-symbols-outlined text-sm">verified</span>
              Lab Certified
            </div>
<div class="flex flex-col text-right">
<span class="text-[10px] uppercase font-bold text-on-surface-variant">Last Recalled</span>
<span class="text-on-surface font-medium text-[11px]">6 days ago</span>
</div>
</div>
</div>
<div class="flex items-center justify-between pt-5 mt-4 border-t border-surface-container gap-2">
<button class="flex-1 py-2 px-3 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors text-center">
            Open Reader
          </button>
<button class="flex-1 py-2 px-3 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors text-center shadow-sm">
            Study Deck
          </button>
<button class="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</article>
</section>
<!-- Ingestion Statistics Drawer / Dashboard Footer -->
<section class="rounded-2xl bg-surface-container-low p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
<div class="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12 w-full">
<!-- Metric 1 -->
<div class="flex flex-col">
<span class="text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1">
            Total Pages Indexed
          </span>
<div class="flex items-baseline gap-2">
<span class="font-headline text-3xl font-bold text-on-surface">3,132</span>
<span class="text-xs font-semibold text-emerald-700">+18% this wk</span>
</div>
</div>
<!-- Metric 2 -->
<div class="flex flex-col">
<span class="text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1">
            Formulas Extracted
          </span>
<div class="flex items-baseline gap-2">
<span class="font-headline text-3xl font-bold text-primary">489</span>
<span class="text-xs font-medium text-on-surface-variant">LaTeX format</span>
</div>
</div>
<!-- Metric 3 -->
<div class="flex flex-col">
<span class="text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1">
            Synthesized Flashcards
          </span>
<div class="flex items-baseline gap-2">
<span class="font-headline text-3xl font-bold text-on-surface">499</span>
<span class="text-xs font-semibold text-primary">SRS Synced</span>
</div>
</div>
<!-- Metric 4 -->
<div class="flex flex-col">
<span class="text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1">
            OCR Parse Accuracy
          </span>
<div class="flex items-baseline gap-2">
<span class="font-headline text-3xl font-bold text-emerald-700">99.4%</span>
<span class="text-xs font-medium text-on-surface-variant">Multi-pass</span>
</div>
</div>
</div>
</section>
</div>
<!-- Interactive JavaScript for Filters, Quick Sync, and Drag-and-Drop Feedback -->
<script>
    document.addEventListener('DOMContentLoaded', () => {
      // Filter functionality
      const filterButtons = document.querySelectorAll('.filter-chip');
      const cards = document.querySelectorAll('.doc-card');
      const searchInput = document.getElementById('doc-search');

      function applyFilter(category) {
        cards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      }

      filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          filterButtons.forEach(b => {
            b.classList.remove('bg-primary', 'text-on-primary');
            b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
          });
          btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
          btn.classList.add('bg-primary', 'text-on-primary');

          const filterVal = btn.getAttribute('data-filter');
          applyFilter(filterVal);
        });
      });

      // Search real-time filtering
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase();
          cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            if (text.includes(query)) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        });
      }

      // Drag and drop zone feedback
      const dropZone = document.getElementById('drop-zone');
      if (dropZone) {
        ['dragenter', 'dragover'].forEach(eventName => {
          dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('bg-primary-fixed/20');
          }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
          dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('bg-primary-fixed/20');
          }, false);
        });

        dropZone.addEventListener('drop', (e) => {
          alert('Academic source files received! Neural parser initialized.');
        });
      }

      // Simulated sync
      const syncBtn = document.getElementById('quick-sync-btn');
      if (syncBtn) {
        syncBtn.addEventListener('click', () => {
          const icon = syncBtn.querySelector('.material-symbols-outlined');
          icon.classList.add('animate-spin');
          setTimeout(() => {
            icon.classList.remove('animate-spin');
            alert('LMS synchronization complete. All lecture repositories are up to date.');
          }, 1200);
        });
      }
    });
  </script>
</div></main></div></body></html>

<!-- StudyTantra - Settings & Preferences (Sahara Edition) -->
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;family=Manrope:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "tertiary": "#8c3c3c", "on-surface": "#3a302a", "error": "#c0392b", "surface": "#faf5ee", "secondary-fixed": "#eae2da", "on-tertiary": "#ffffff", "on-background": "#3a302a", "outline": "#9a9088", "tertiary-container": "#d47070", "primary-fixed-dim": "#f0a878", "surface-bright": "#faf5ee", "surface-variant": "#ece6dc", "tertiary-fixed-dim": "#e8a0a0", "on-secondary": "#ffffff", "secondary-fixed-dim": "#cec6be", "surface-container-low": "#f6f0e8", "primary-container": "#e08850", "surface-dim": "#dcd6cc", "primary-fixed": "#fbe8d8", "on-error": "#ffffff", "surface-container": "#f2ece4", "on-tertiary-fixed-variant": "#6e3030", "surface-container-lowest": "#ffffff", "on-primary-container": "#fbe8d8", "secondary": "#78706a", "surface-container-highest": "#e6e0d6", "outline-variant": "#d8d0c8", "secondary-container": "#eae2da", "on-primary-fixed": "#401a08", "error-container": "#fce4e0", "on-secondary-fixed-variant": "#504840", "on-tertiary-container": "#3a2020", "inverse-primary": "#f0a878", "inverse-surface": "#3a302a", "on-tertiary-fixed": "#2e1515", "tertiary-fixed": "#fce0e0", "on-primary-fixed-variant": "#8a4518", "on-primary": "#ffffff", "surface-container-high": "#ece6dc", "background": "#faf5ee", "on-secondary-fixed": "#2a2420", "on-secondary-container": "#605850", "surface-tint": "#c2652a", "primary": "#c2652a", "on-error-container": "#7a1a10", "inverse-on-surface": "#faf5ee", "on-surface-variant": "#605850" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": {}, "fontFamily": { "headline": [ "EB Garamond" ], "display": [ "EB Garamond" ], "body": [ "Manrope" ], "label": [ "Manrope" ] }, "fontSize": {} } } }</script></head><body class="bg-surface font-body text-on-surface antialiased"><aside class="fixed left-0 top-0 h-screen w-72 bg-surface-container-low shadow-[0_2px_16px_rgba(58,48,42,0.04)] z-50 flex flex-col justify-between py-6 px-5 border-r border-outline-variant/30"><div class="flex flex-col"><div class="px-3 pb-6 flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm"><span class="material-symbols-outlined text-2xl">local_fire_department</span></div><div class="flex flex-col"><span class="font-headline text-2xl font-bold tracking-tight text-on-surface leading-none">StudyTantra</span><span class="text-[11px] font-label font-medium tracking-wide uppercase text-on-surface-variant mt-1">AI Spaced Recall</span></div></div><nav class="flex flex-col gap-1 mt-1" data-active-classes="bg-primary text-on-primary font-semibold shadow-sm"><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="dashboard" href="#">Dashboard</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="document-library" href="#">Document Library</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="flashcards-vault" href="#">Flashcards Vault</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="spaced-review" href="#">Spaced Review</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="exam-planner" href="#">Exam Planner</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="quiz-engine" href="#">Quiz Engine</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="collection-workspace" href="#">Collection Workspace</a><a aria-current="page" class="flex items-center px-3.5 py-2.5 rounded-lg transition-colors bg-primary text-on-primary font-semibold shadow-sm" data-path="settings-preferences" href="#">Settings &amp; Preferences</a></nav></div><div class="flex flex-col gap-4 px-1"><div class="p-4 rounded-xl bg-surface-container flex items-center justify-between shadow-[0_2px_16px_rgba(58,48,42,0.04)]"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[20px]">flare</span></div><div class="flex flex-col"><span class="text-[11px] font-label font-medium uppercase text-on-surface-variant">Mindful Habit</span><span class="text-xs font-semibold text-on-surface">14 Days Streak</span></div></div><span class="text-xs font-bold text-primary font-label bg-surface px-2 py-1 rounded-md">Lv. 4</span></div><div class="flex items-center justify-between pt-2 border-t border-outline-variant/40"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div><div class="flex flex-col"><span class="text-xs font-semibold text-on-surface leading-snug">Arya Sharma</span><span class="text-[10px] text-on-surface-variant">Scholar Plan</span></div></div><button aria-label="Account switcher" class="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">unfold_more</span></button></div></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(58,48,42,0.04)]"><div class="h-16 w-full px-8 flex items-center justify-between gap-6"><div class="flex-1 max-w-xl"><div class="relative flex items-center"><span class="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">search</span><input class="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="Search concepts, textbooks, notes, formulas..." type="text"/></div></div><div class="flex items-center gap-3.5"><div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface"><span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span><span class="font-label font-medium text-[11px] text-on-surface-variant">Active Deck:</span><span class="font-semibold text-primary text-[11px]">Cognitive Neuroscience</span></div><button aria-label="Notifications" class="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary"></span></button><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="relative pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<!-- Top Visual Accent Band -->
<div class="relative w-full overflow-hidden bg-gradient-to-r from-surface-container via-surface-container-low to-surface-container-high py-10 px-8 lg:px-12">
<div class="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
<div class="absolute left-1/3 bottom-0 w-64 h-32 rounded-full bg-tertiary/5 blur-2xl pointer-events-none"></div>
<div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
<div class="space-y-2">
<div class="flex items-center gap-2">
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-label font-semibold tracking-wider uppercase bg-primary-fixed text-on-primary-fixed">
<span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            System Kernel 4.8.2
          </span>
<span class="text-xs font-label text-on-surface-variant font-medium">Memory Architecture • IIT Delhi Profile</span>
</div>
<h1 class="font-headline text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-tight">
          Settings &amp; Learning Engine Preferences
        </h1>
<p class="font-body text-sm lg:text-base text-on-surface-variant max-w-2xl">
          Customize spaced repetition algorithms, AI model parameters, university LMS integrations, and notifications.
        </p>
</div>
<!-- Quick Telemetry Chip -->
<div class="flex items-center gap-4 bg-surface-container-lowest/80 backdrop-blur-md p-3.5 rounded-2xl shadow-sm border-0">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[22px]">network_check</span>
</div>
<div>
<div class="text-[11px] font-label uppercase tracking-wider text-on-surface-variant">Sync Latency</div>
<div class="text-xs font-semibold text-on-surface">18ms • Canvas Connected</div>
</div>
</div>
<div class="h-8 w-px bg-surface-container-highest"></div>
<div>
<div class="text-[11px] font-label uppercase tracking-wider text-on-surface-variant">Scheduled Reps</div>
<div class="text-xs font-bold text-primary font-label">142 Today</div>
</div>
</div>
</div>
</div>
<!-- Main Grid Workspace -->
<div class="max-w-7xl mx-auto w-full px-6 lg:px-12 py-10">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
<!-- Sub-Tabs Navigation Sidebar -->
<nav class="lg:col-span-3 space-y-2 sticky top-24">
<div class="text-[11px] font-label font-bold uppercase tracking-widest text-outline px-3 mb-3">
          Configuration Sections
        </div>
<button class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-primary text-on-primary shadow-sm text-left transition-all group font-label text-xs font-semibold" type="button">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[19px]">psychology</span>
<span>FSRS &amp; Spaced Repetition</span>
</div>
<span class="material-symbols-outlined text-[16px] text-on-primary/70">chevron_right</span>
</button>
<button class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-all text-left font-label text-xs font-medium" type="button">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[19px] text-on-surface-variant">smart_toy</span>
<span>AI Synthesis &amp; Models</span>
</div>
<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant">v3.5</span>
</button>
<button class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-all text-left font-label text-xs font-medium" type="button">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[19px] text-on-surface-variant">school</span>
<span>Academic Profile &amp; University</span>
</div>
</button>
<button class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-all text-left font-label text-xs font-medium" type="button">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[19px] text-on-surface-variant">sync_alt</span>
<span>Integrations (Canvas/Notion)</span>
</div>
<span class="w-2 h-2 rounded-full bg-emerald-600"></span>
</button>
<button class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-all text-left font-label text-xs font-medium" type="button">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[19px] text-on-surface-variant">palette</span>
<span>Appearance &amp; Themes</span>
</div>
</button>
<button class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-all text-left font-label text-xs font-medium" type="button">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[19px] text-on-surface-variant">lock_person</span>
<span>Data Privacy &amp; Exports</span>
</div>
</button>
<!-- Informative Ambient Banner -->
<div class="pt-6">
<div class="p-4 rounded-2xl bg-surface-container-low text-on-surface relative overflow-hidden shadow-sm">
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined text-primary text-[18px]">verified</span>
<span class="font-headline font-semibold text-sm">Empirical Optimization</span>
</div>
<p class="text-[11px] leading-relaxed text-on-surface-variant">
              Your memory model has processed <strong class="text-on-surface">1,480 flashcard log entries</strong>. Current stability retention sits at 91.4%.
            </p>
</div>
</div>
</nav>
<!-- Right Content Pane -->
<div class="lg:col-span-9 space-y-8">
<!-- Section 1: Spaced Repetition Algorithm Tuning -->
<section class="bg-surface-container-lowest p-7 lg:p-9 rounded-2xl shadow-sm space-y-7">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b-0">
<div>
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="text-xs font-label font-bold uppercase tracking-wider text-primary">Core Recall Architecture</span>
</div>
<h2 class="font-headline text-2xl lg:text-3xl font-bold text-on-surface mt-1">
                Spaced Repetition Algorithm Tuning
              </h2>
</div>
<span class="self-start sm:self-auto px-3 py-1 bg-surface-container text-on-surface-variant text-[11px] font-label font-semibold rounded-full">
              FSRS-4.5 Active
            </span>
</div>
<!-- Algorithm Selector Cards -->
<div class="space-y-3">
<label class="block text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant">
              Active Memory Scheduling Formula
            </label>
<div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
<!-- Option 1: FSRS (Selected) -->
<div class="relative p-4 rounded-xl bg-surface-container-low ring-2 ring-primary cursor-pointer transition-all shadow-sm">
<div class="flex items-start justify-between">
<span class="font-headline text-base font-bold text-on-surface">FSRS v4.5</span>
<span class="material-symbols-outlined text-primary text-[18px]">radio_button_checked</span>
</div>
<p class="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                  Free Spaced Repetition Scheduler. Utilizes 17-parameter DSR (Difficulty, Stability, Retrievability) modeling.
                </p>
<div class="mt-3 inline-block text-[10px] font-label font-bold px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">
                  Recommended • +28% Efficiency
                </div>
</div>
<!-- Option 2: Anki SM-2 -->
<div class="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer">
<div class="flex items-start justify-between">
<span class="font-headline text-base font-bold text-on-surface">Anki SM-2</span>
<span class="material-symbols-outlined text-outline text-[18px]">radio_button_unchecked</span>
</div>
<p class="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                  Classical heuristic SuperMemo-2 derivative. Fixed easiness multiplier with static lapse intervals.
                </p>
<div class="mt-3 text-[10px] font-label text-on-surface-variant">Legacy Compatibility</div>
</div>
<!-- Option 3: SuperMemo-17 -->
<div class="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer">
<div class="flex items-start justify-between">
<span class="font-headline text-base font-bold text-on-surface">SuperMemo-17</span>
<span class="material-symbols-outlined text-outline text-[18px]">radio_button_unchecked</span>
</div>
<p class="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                  Algorithmic complex matrix modeling stabilization vectors. Computationally intensive.
                </p>
<div class="mt-3 text-[10px] font-label text-on-surface-variant">Experimental</div>
</div>
</div>
</div>
<!-- Target Retention Slider -->
<div class="p-5 rounded-2xl bg-surface-container-low space-y-4">
<div class="flex items-center justify-between">
<div>
<label class="font-label text-xs font-bold uppercase tracking-wider text-on-surface">
                  Target Retention Rate
                </label>
<p class="text-[11px] text-on-surface-variant mt-0.5">
                  Probability of successfully recalling a flashcard when it becomes due.
                </p>
</div>
<div class="flex items-baseline gap-1 bg-surface-container-lowest px-3 py-1.5 rounded-xl shadow-sm">
<span class="font-headline text-2xl font-bold text-primary" id="retentionVal">90</span>
<span class="text-xs font-semibold text-primary font-label">%</span>
</div>
</div>
<!-- Custom Slider -->
<div class="relative w-full pt-1">
<input class="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" id="retentionSlider" max="97" min="80" type="range" value="90"/>
<div class="flex justify-between text-[10px] font-label font-medium text-outline mt-2">
<span>80% (Casual recall)</span>
<span class="text-primary font-bold">90% (Empirically Optimal)</span>
<span>97% (High workload)</span>
</div>
</div>
<!-- Inline SVG Curve & Analytical Note -->
<div class="flex flex-col md:flex-row items-center gap-4 pt-2">
<div class="w-full md:w-48 h-12 bg-surface-container-lowest rounded-lg p-1.5 flex items-center justify-center">
<svg class="w-full h-full text-primary" fill="none" viewbox="0 0 160 36">
<path d="M 5 30 Q 80 28, 110 20 T 155 4" stroke="currentColor" stroke-linecap="round" stroke-width="2"></path>
<circle cx="110" cy="20" fill="currentColor" r="3.5"></circle>
</svg>
</div>
<p class="text-[11px] leading-relaxed text-on-surface-variant">
<strong class="text-on-surface">Empirical note:</strong> Higher target retention requires exponentially more daily reviews. 90% is empirically optimal for university STEM curricula with minimal fatigue.
              </p>
</div>
</div>
<!-- Controls Grid: Daily Limit & Exam Buffer -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
<!-- Max Daily Reviews -->
<div class="space-y-2">
<label class="block font-label text-xs font-bold uppercase tracking-wider text-on-surface">
                Maximum Daily Review Limit
              </label>
<div class="relative flex items-center">
<input class="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all" type="text" value="150"/>
<span class="absolute right-4 text-xs font-label text-on-surface-variant">cards / day</span>
</div>
<p class="text-[11px] text-on-surface-variant">
                Surplus cards rollover automatically into tomorrow's spaced window without reset penalties.
              </p>
</div>
<!-- Free Days / Exam Buffer Switch -->
<div class="p-4 rounded-xl bg-surface-container-low flex items-start justify-between gap-4">
<div class="space-y-1">
<span class="font-label text-xs font-bold text-on-surface block">
                  Free Days &amp; Exam Pre-Buffer
                </span>
<p class="text-[11px] text-on-surface-variant leading-relaxed">
                  Auto-compress review schedules 5 days before exams and pause repetition decay during registered term breaks.
                </p>
</div>
<label class="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-0.5">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</section>
<!-- Section 2: AI Flashcard & Quiz Synthesizer -->
<section class="bg-surface-container-lowest p-7 lg:p-9 rounded-2xl shadow-sm space-y-7">
<div class="flex items-center gap-2 pb-1">
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="text-xs font-label font-bold uppercase tracking-wider text-primary">Generative Synthesizer</span>
</div>
<div>
<h2 class="font-headline text-2xl lg:text-3xl font-bold text-on-surface">
              AI Flashcard &amp; Quiz Synthesizer
            </h2>
<p class="text-xs text-on-surface-variant mt-1">
              Select reasoning backends and granular extraction heuristics for lecture slides and textbook uploads.
            </p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<!-- Ingestion AI Engine Selection -->
<div class="space-y-2">
<label class="block font-label text-xs font-bold uppercase tracking-wider text-on-surface">
                Ingestion AI Engine
              </label>
<div class="relative">
<select class="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all pr-10">
<option selected="">Claude-3.5 Sonnet (Deep Reasoning &amp; Nuanced Proofs)</option>
<option>GPT-4o (Fast Extraction &amp; Multimodal Tables)</option>
<option>Mistral Large (Open Weights Academic Edition)</option>
</select>
<span class="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant text-[18px] pointer-events-none">expand_more</span>
</div>
<p class="text-[11px] text-on-surface-variant">Recommended for complex engineering, neuroscience, and mathematical proofs.</p>
</div>
<!-- Automatic Formula LaTeX Parsing Toggle -->
<div class="p-4 rounded-xl bg-surface-container-low flex items-start justify-between gap-4">
<div class="space-y-1">
<span class="font-label text-xs font-bold text-on-surface block">
                  LaTeX Formula Transcription
                </span>
<p class="text-[11px] text-on-surface-variant leading-relaxed">
                  Convert blackboard images, handwritten math, and PDF equations into standardized KaTeX delimiters ($$...$$).
                </p>
</div>
<label class="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-0.5">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
<!-- Question Complexity Level Segmented Control -->
<div class="space-y-2.5">
<label class="block font-label text-xs font-bold uppercase tracking-wider text-on-surface">
              Synthesized Question Complexity Level
            </label>
<div class="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-xl bg-surface-container-low">
<button class="py-2.5 px-3 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-all text-center" type="button">
                Foundational Recall
              </button>
<button class="py-2.5 px-3 rounded-lg text-xs font-semibold bg-surface-container-lowest text-primary shadow-sm transition-all text-center" type="button">
                Undergraduate Core
              </button>
<button class="py-2.5 px-3 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-all text-center" type="button">
                Graduate / Rigorous
              </button>
</div>
</div>
<!-- Auto-Cloze Sensitivity Slider -->
<div class="p-5 rounded-2xl bg-surface-container-low space-y-3">
<div class="flex items-center justify-between">
<div>
<label class="font-label text-xs font-bold uppercase tracking-wider text-on-surface">
                  Auto-Cloze Extraction Density
                </label>
<p class="text-[11px] text-on-surface-variant">Determines how aggressively definitions, key constants, and mechanisms are blanked out.</p>
</div>
<span class="text-xs font-bold px-2.5 py-1 rounded bg-surface-container-lowest text-primary font-label">Balanced (Medium)</span>
</div>
<input class="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" max="5" min="1" type="range" value="3"/>
<div class="flex justify-between text-[10px] font-label text-outline">
<span>Sparse (Major concepts only)</span>
<span>Rigorous (Key terms, constants, &amp; derivations)</span>
</div>
</div>
</section>
<!-- Section 3: University & LMS Sync -->
<section class="bg-surface-container-lowest p-7 lg:p-9 rounded-2xl shadow-sm space-y-6">
<div class="flex items-center justify-between">
<div>
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="text-xs font-label font-bold uppercase tracking-wider text-primary">Academic Pipelines</span>
</div>
<h2 class="font-headline text-2xl lg:text-3xl font-bold text-on-surface mt-1">
                University &amp; LMS Sync
              </h2>
</div>
<span class="px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-label font-bold rounded-full flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Connections (2 Active)
            </span>
</div>
<div class="space-y-4">
<!-- Campus Institution Card -->
<div class="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div class="flex items-center gap-3.5">
<div class="w-11 h-11 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary font-headline text-lg font-bold">
                  IIT
                </div>
<div>
<div class="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Campus Institution</div>
<div class="text-xs font-bold text-on-surface">Indian Institute of Technology • Tier 1 Engineering</div>
<div class="text-[11px] text-on-surface-variant">Department of Computer Science &amp; Cognitive Studies</div>
</div>
</div>
<button class="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container text-xs font-semibold font-label transition-colors self-start sm:self-auto" type="button">
                Change Institute
              </button>
</div>
<!-- Canvas LMS Sync Item -->
<div class="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div class="flex items-start gap-3.5">
<div class="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary mt-0.5">
<span class="material-symbols-outlined text-[22px]">auto_stories</span>
</div>
<div>
<div class="flex items-center gap-2">
<span class="text-xs font-bold text-on-surface">Canvas LMS Integration</span>
<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">Connected</span>
</div>
<p class="text-[11px] text-on-surface-variant mt-0.5">
                    Last synced: 28 min ago • 3 active courses synced (CS401, NEUR210, STAT502)
                  </p>
</div>
</div>
<div class="flex items-center gap-2 self-end sm:self-auto">
<button class="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:text-primary text-xs font-semibold transition-colors flex items-center gap-1.5" type="button">
<span class="material-symbols-outlined text-[15px]">sync</span>
                  Sync Now
                </button>
</div>
</div>
<!-- Anki Deck 2-way sync Item -->
<div class="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div class="flex items-start gap-3.5">
<div class="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed mt-0.5">
<span class="material-symbols-outlined text-[22px]">flip</span>
</div>
<div>
<div class="flex items-center gap-2">
<span class="text-xs font-bold text-on-surface">Anki 2-Way Deck Bridge</span>
<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary-fixed text-primary">Active</span>
</div>
<p class="text-[11px] text-on-surface-variant mt-0.5">
                    Realtime background sync to AnkiConnect (Port 8765) • Automatic .apkg bundle backup generated every midnight.
                  </p>
</div>
</div>
<label class="relative inline-flex items-center cursor-pointer flex-shrink-0 self-end sm:self-auto">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</section>
<!-- Section 4: Appearance & Design Theme -->
<section class="bg-surface-container-lowest p-7 lg:p-9 rounded-2xl shadow-sm space-y-6">
<div class="flex items-center justify-between">
<div>
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="text-xs font-label font-bold uppercase tracking-wider text-primary">Sensory Aesthetics</span>
</div>
<h2 class="font-headline text-2xl lg:text-3xl font-bold text-on-surface mt-1">
                Appearance &amp; Study Theme
              </h2>
</div>
<span class="text-xs font-semibold text-primary font-label">Warm Sahara Active</span>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
<!-- Theme Card 1: Sahara (Active) -->
<div class="relative p-4 rounded-2xl bg-surface ring-2 ring-primary transition-all flex flex-col justify-between h-44 shadow-sm">
<div class="space-y-1">
<div class="flex items-center justify-between">
<span class="font-headline text-base font-bold text-on-surface">Sahara</span>
<span class="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white">
<span class="material-symbols-outlined text-[12px]">check</span>
</span>
</div>
<p class="text-[11px] text-on-surface-variant">Sun-baked linen, terracotta focus states, Garamond editorial serifs.</p>
</div>
<!-- Color Palette Swatches -->
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-[#faf5ee] shadow-sm"></div>
<div class="w-6 h-6 rounded-full bg-[#c2652a] shadow-sm"></div>
<div class="w-6 h-6 rounded-full bg-[#8c3c3c] shadow-sm"></div>
<div class="w-6 h-6 rounded-full bg-[#3a302a] shadow-sm"></div>
</div>
</div>
<!-- Theme Card 2: Obsidian (Dark) -->
<div class="p-4 rounded-2xl bg-[#1e1b18] text-[#f5efe6] transition-all flex flex-col justify-between h-44 cursor-pointer hover:opacity-90">
<div class="space-y-1">
<div class="flex items-center justify-between">
<span class="font-headline text-base font-bold text-[#faf5ee]">Obsidian</span>
<span class="text-[10px] font-label font-semibold text-[#c2652a]">Dark Mode</span>
</div>
<p class="text-[11px] text-[#cec6be]">Ultra-deep warm charcoal with muted bronze luminescence.</p>
</div>
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-[#181412] shadow-sm"></div>
<div class="w-6 h-6 rounded-full bg-[#c2652a] shadow-sm"></div>
<div class="w-6 h-6 rounded-full bg-[#332a24] shadow-sm"></div>
<div class="w-6 h-6 rounded-full bg-[#e6e0d6] shadow-sm"></div>
</div>
</div>
<!-- Theme Card 3: Nocturnal Scholar -->
<div class="p-4 rounded-2xl bg-[#241c19] text-[#f5efe6] transition-all flex flex-col justify-between h-44 cursor-pointer hover:opacity-90">
<div class="space-y-1">
<div class="flex items-center justify-between">
<span class="font-headline text-base font-bold text-[#faf5ee]">Nocturnal Scholar</span>
<span class="text-[10px] font-label font-semibold text-[#e8a0a0]">Sepia Tint</span>
</div>
<p class="text-[11px] text-[#cec6be]">Dim amber illumination designed for late-night exam cramming.</p>
</div>
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-[#2a201c] shadow-sm"></div>
<div class="w-6 h-6 rounded-full bg-[#8c3c3c] shadow-sm"></div>
<div class="w-6 h-6 rounded-full bg-[#e08850] shadow-sm"></div>
<div class="w-6 h-6 rounded-full bg-[#faf5ee] shadow-sm"></div>
</div>
</div>
</div>
</section>
<!-- Sticky / Pinned Bottom Action Bar -->
<div class="sticky bottom-6 z-30 p-4 rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-lg flex items-center justify-between">
<div class="flex items-center gap-2 text-xs text-on-surface-variant font-label">
<span class="material-symbols-outlined text-primary text-[18px]">info</span>
<span class="hidden sm:inline">Settings automatically sync across all desktop and tablet clients.</span>
<span class="sm:hidden">All settings ready.</span>
</div>
<div class="flex items-center gap-3">
<button class="px-5 py-2.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-label" type="button">
              Cancel
            </button>
<button class="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label font-semibold text-xs transition-all shadow-sm flex items-center gap-2" id="saveBtn" type="button">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
              Save Changes
            </button>
</div>
</div>
</div>
</div>
</div>
<!-- Interactive script for Retention slider and dynamic feedback -->
<script>
    const slider = document.getElementById('retentionSlider');
    const label = document.getElementById('retentionVal');
    const saveBtn = document.getElementById('saveBtn');

    if (slider && label) {
      slider.addEventListener('input', (e) => {
        label.textContent = e.target.value;
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">progress_activity</span> Synchronizing...';
        saveBtn.classList.add('opacity-80', 'pointer-events-none');

        setTimeout(() => {
          saveBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">done</span> Saved Successfully';
          saveBtn.classList.remove('opacity-80');
          setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.classList.remove('pointer-events-none');
          }, 2000);
        }, 900);
      });
    }
  </script>
</div></main></div></body></html>

<!-- StudyTantra - Flashcards Vault & Generator (Sahara Edition) -->
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;family=Manrope:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "tertiary": "#8c3c3c", "on-surface": "#3a302a", "error": "#c0392b", "surface": "#faf5ee", "secondary-fixed": "#eae2da", "on-tertiary": "#ffffff", "on-background": "#3a302a", "outline": "#9a9088", "tertiary-container": "#d47070", "primary-fixed-dim": "#f0a878", "surface-bright": "#faf5ee", "surface-variant": "#ece6dc", "tertiary-fixed-dim": "#e8a0a0", "on-secondary": "#ffffff", "secondary-fixed-dim": "#cec6be", "surface-container-low": "#f6f0e8", "primary-container": "#e08850", "surface-dim": "#dcd6cc", "primary-fixed": "#fbe8d8", "on-error": "#ffffff", "surface-container": "#f2ece4", "on-tertiary-fixed-variant": "#6e3030", "surface-container-lowest": "#ffffff", "on-primary-container": "#fbe8d8", "secondary": "#78706a", "surface-container-highest": "#e6e0d6", "outline-variant": "#d8d0c8", "secondary-container": "#eae2da", "on-primary-fixed": "#401a08", "error-container": "#fce4e0", "on-secondary-fixed-variant": "#504840", "on-tertiary-container": "#3a2020", "inverse-primary": "#f0a878", "inverse-surface": "#3a302a", "on-tertiary-fixed": "#2e1515", "tertiary-fixed": "#fce0e0", "on-primary-fixed-variant": "#8a4518", "on-primary": "#ffffff", "surface-container-high": "#ece6dc", "background": "#faf5ee", "on-secondary-fixed": "#2a2420", "on-secondary-container": "#605850", "surface-tint": "#c2652a", "primary": "#c2652a", "on-error-container": "#7a1a10", "inverse-on-surface": "#faf5ee", "on-surface-variant": "#605850" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": {}, "fontFamily": { "headline": [ "EB Garamond" ], "display": [ "EB Garamond" ], "body": [ "Manrope" ], "label": [ "Manrope" ] }, "fontSize": {} } } }</script></head><body class="bg-surface font-body text-on-surface antialiased"><aside class="fixed left-0 top-0 h-screen w-72 bg-surface-container-low shadow-[0_2px_16px_rgba(58,48,42,0.04)] z-50 flex flex-col justify-between py-6 px-5 border-r border-outline-variant/30"><div class="flex flex-col"><div class="px-3 pb-6 flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm"><span class="material-symbols-outlined text-2xl">local_fire_department</span></div><div class="flex flex-col"><span class="font-headline text-2xl font-bold tracking-tight text-on-surface leading-none">StudyTantra</span><span class="text-[11px] font-label font-medium tracking-wide uppercase text-on-surface-variant mt-1">AI Spaced Recall</span></div></div><nav class="flex flex-col gap-1 mt-1" data-active-classes="bg-primary text-on-primary font-semibold shadow-sm"><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="dashboard" href="#">Dashboard</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="document-library" href="#">Document Library</a><a aria-current="page" class="flex items-center px-3.5 py-2.5 rounded-lg transition-colors bg-primary text-on-primary font-semibold shadow-sm" data-path="flashcards-vault" href="#">Flashcards Vault</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="spaced-review" href="#">Spaced Review</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="exam-planner" href="#">Exam Planner</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="quiz-engine" href="#">Quiz Engine</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="collection-workspace" href="#">Collection Workspace</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="settings-preferences" href="#">Settings &amp; Preferences</a></nav></div><div class="flex flex-col gap-4 px-1"><div class="p-4 rounded-xl bg-surface-container flex items-center justify-between shadow-[0_2px_16px_rgba(58,48,42,0.04)]"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[20px]">flare</span></div><div class="flex flex-col"><span class="text-[11px] font-label font-medium uppercase text-on-surface-variant">Mindful Habit</span><span class="text-xs font-semibold text-on-surface">14 Days Streak</span></div></div><span class="text-xs font-bold text-primary font-label bg-surface px-2 py-1 rounded-md">Lv. 4</span></div><div class="flex items-center justify-between pt-2 border-t border-outline-variant/40"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div><div class="flex flex-col"><span class="text-xs font-semibold text-on-surface leading-snug">Arya Sharma</span><span class="text-[10px] text-on-surface-variant">Scholar Plan</span></div></div><button aria-label="Account switcher" class="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">unfold_more</span></button></div></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(58,48,42,0.04)]"><div class="h-16 w-full px-8 flex items-center justify-between gap-6"><div class="flex-1 max-w-xl"><div class="relative flex items-center"><span class="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">search</span><input class="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="Search concepts, textbooks, notes, formulas..." type="text"/></div></div><div class="flex items-center gap-3.5"><div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface"><span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span><span class="font-label font-medium text-[11px] text-on-surface-variant">Active Deck:</span><span class="font-semibold text-primary text-[11px]">Cognitive Neuroscience</span></div><button aria-label="Notifications" class="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary"></span></button><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="relative pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<div class="px-8 py-8 flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
<!-- Header Section -->
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
<div class="flex flex-col gap-2 max-w-3xl">
<div class="flex items-center gap-2">
<span class="text-[11px] font-label font-bold tracking-widest uppercase text-primary bg-primary-fixed/60 px-2.5 py-1 rounded-md">Neural Spaced Repetition</span>
<span class="text-xs font-label text-on-surface-variant font-medium flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span> FSRS-4.5 Active Matrix
          </span>
</div>
<h1 class="font-headline text-4xl lg:text-5xl font-medium tracking-tight text-on-surface leading-tight">
          Flashcards Vault &amp; Algorithmic Generator
        </h1>
<p class="font-body text-sm lg:text-base text-on-surface-variant leading-relaxed">
          FSRS-4.5 optimized deck repository with multi-modal cloze, concept pairing, and formula testing.
        </p>
</div>
<div class="flex items-center gap-3 shrink-0">
<button class="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-label font-semibold shadow-sm transition-all hover:translate-y-[-1px]" id="open-generator-btn">
<span class="material-symbols-outlined text-[18px] text-primary">auto_awesome</span>
<span>+ Generate New Cards</span>
<span class="text-[10px] bg-primary text-on-primary font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">AI</span>
</button>
<button class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-label font-bold shadow-md transition-all hover:translate-y-[-1px] group">
<span>Study Due Cards (18)</span>
<span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
</button>
</div>
</div>
<!-- Top Metric Cards Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
<!-- Metric 1 -->
<div class="p-6 rounded-2xl bg-surface-container-low shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col justify-between relative overflow-hidden group">
<div class="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-primary/5 pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
<div class="flex items-center justify-between">
<span class="text-xs font-label font-medium uppercase tracking-wider text-on-surface-variant">Total Cards in Vault</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface">
<span class="material-symbols-outlined text-[18px]">inventory_2</span>
</div>
</div>
<div class="mt-4 flex items-baseline gap-3">
<span class="font-headline text-4xl lg:text-5xl font-medium text-on-surface">499</span>
<span class="text-xs font-label font-semibold text-primary bg-primary-fixed/80 px-2 py-0.5 rounded-full flex items-center gap-0.5">
<span class="material-symbols-outlined text-[14px]">trending_up</span> +38 this week
          </span>
</div>
<div class="mt-4 pt-3 flex items-center justify-between text-[11px] font-label text-on-surface-variant">
<span>8 Active Decks</span>
<span>16 Tags Synced</span>
</div>
</div>
<!-- Metric 2 -->
<div class="p-6 rounded-2xl bg-surface-container-low shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col justify-between relative overflow-hidden group">
<div class="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-tertiary/5 pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
<div class="flex items-center justify-between">
<span class="text-xs font-label font-medium uppercase tracking-wider text-on-surface-variant">Due for Today</span>
<div class="w-8 h-8 rounded-lg bg-tertiary-fixed/60 flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined text-[18px]">schedule</span>
</div>
</div>
<div class="mt-4 flex items-baseline gap-3">
<span class="font-headline text-4xl lg:text-5xl font-medium text-tertiary">38</span>
<span class="text-xs font-label text-on-surface-variant font-medium">cards scheduled</span>
</div>
<div class="mt-4 pt-3 flex items-center justify-between text-[11px] font-label text-on-surface-variant">
<span class="text-tertiary font-semibold">Across 3 urgent decks</span>
<span>Est. 14 mins</span>
</div>
</div>
<!-- Metric 3 -->
<div class="p-6 rounded-2xl bg-surface-container-low shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col justify-between relative overflow-hidden group">
<div class="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-primary/5 pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
<div class="flex items-center justify-between">
<span class="text-xs font-label font-medium uppercase tracking-wider text-on-surface-variant">Mastered Cards</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[18px]">verified</span>
</div>
</div>
<div class="mt-4 flex items-baseline gap-3">
<span class="font-headline text-4xl lg:text-5xl font-medium text-on-surface">342</span>
<span class="text-xs font-label font-medium text-on-surface-variant">68.5% of vault</span>
</div>
<div class="mt-4 pt-3 flex items-center justify-between text-[11px] font-label text-on-surface-variant">
<span>Stability &gt; 30 days</span>
<span class="text-primary font-semibold">Decay &lt; 2.1%</span>
</div>
</div>
<!-- Metric 4 -->
<div class="p-6 rounded-2xl bg-surface-container-low shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col justify-between relative overflow-hidden group">
<div class="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-primary/5 pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
<div class="flex items-center justify-between">
<span class="text-xs font-label font-medium uppercase tracking-wider text-on-surface-variant">Average Retention</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[18px]">psychology</span>
</div>
</div>
<div class="mt-4 flex items-baseline gap-3">
<span class="font-headline text-4xl lg:text-5xl font-medium text-primary">91.4%</span>
<span class="text-xs font-label text-on-surface-variant">Target: 90.0%</span>
</div>
<div class="mt-4 pt-3 flex items-center gap-2">
<div class="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 91.4%"></div>
</div>
<span class="text-[10px] font-label font-bold text-primary">+1.4%</span>
</div>
</div>
</div>
<!-- AI Generator Collapsible Panel -->
<div class="rounded-2xl bg-surface-container-low p-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col gap-5 transition-all duration-300" id="ai-generator-panel">
<div class="flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
<span class="material-symbols-outlined text-[20px]">psychology_alt</span>
</div>
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="font-headline text-xl font-bold text-on-surface">Tantra AI Algorithmic Generator</span>
<span class="text-[10px] font-label font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed">Claude 3.5 Sonnet</span>
</div>
<span class="text-xs font-body text-on-surface-variant">Paste syllabus excerpts, raw textbooks, or LaTeX lecture slides to infer FSRS recall units.</span>
</div>
</div>
<button class="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors" id="close-generator-btn" title="Minimize generator">
<span class="material-symbols-outlined text-[20px]">expand_less</span>
</button>
</div>
<div class="flex flex-col gap-3">
<div class="relative">
<textarea class="w-full p-4 rounded-xl bg-surface-container-lowest text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-inner resize-none transition-all font-body leading-relaxed" placeholder="Paste paragraph, theorem, proof step, or syllabus section to auto-generate cards... (e.g. 'In backward-oriented concurrency control, validation checks whether the current transaction’s read set intersects with write sets of concurrent validated transactions...')" rows="3"></textarea>
<div class="absolute right-3 bottom-3 flex items-center gap-2">
<button class="px-2 py-1 rounded-md bg-surface-container text-[11px] font-label font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">attachment</span> Attach PDF
            </button>
<button class="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-label font-semibold shadow-sm hover:bg-primary/90 transition-all flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px]">bolt</span> Generate with Claude-3.5 Sonnet
            </button>
</div>
</div>
<div class="flex flex-wrap items-center justify-between gap-3 pt-1">
<div class="flex flex-wrap items-center gap-2">
<span class="text-xs font-label text-on-surface-variant font-medium">Quick Extraction Presets:</span>
<button class="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-label font-medium transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-[14px] text-primary">menu_book</span> Extract Definitions
            </button>
<button class="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-label font-medium transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-[14px] text-primary">code_blocks</span> Generate Cloze Tests
            </button>
<button class="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-label font-medium transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-[14px] text-primary">functions</span> LaTeX Proof Steps
            </button>
<button class="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-label font-medium transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-[14px] text-tertiary">quiz</span> High-Yield Exam Questions
            </button>
</div>
<div class="flex items-center gap-2 text-xs font-label text-on-surface-variant">
<span>Target Deck:</span>
<span class="font-semibold text-on-surface">CS-402: DBMS</span>
</div>
</div>
</div>
</div>
<!-- Control & Filter Bar -->
<div class="flex flex-col gap-4">
<div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
<!-- Search and Deck Selector -->
<div class="flex flex-1 flex-col sm:flex-row items-center gap-3">
<div class="relative w-full sm:w-96">
<span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">search</span>
<input class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-[0_2px_16px_rgba(58,48,42,0.02)] transition-all" placeholder="Search prompts, answers, LaTeX equations..." type="text"/>
</div>
<div class="relative w-full sm:w-80">
<select class="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-xs font-label font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-[0_2px_16px_rgba(58,48,42,0.02)] cursor-pointer appearance-none pr-10">
<option selected="">CS-402: Database Management Systems (142 cards)</option>
<option>MATH-301: Linear Algebra &amp; Spectral Theory (88 cards)</option>
<option>BIO-210: Cellular Signal Pathways (114 cards)</option>
<option>NEURO-501: Synaptic Plasticity &amp; Long-Term Potentiation (95 cards)</option>
<option>PHIL-104: Formal Epistemology (60 cards)</option>
</select>
<span class="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none">expand_more</span>
</div>
</div>
<!-- Utility Action Buttons -->
<div class="flex items-center gap-2 shrink-0 self-end lg:self-center">
<button class="px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs font-label font-medium flex items-center gap-1.5 transition-colors">
<span class="material-symbols-outlined text-[16px]">swap_vert</span>
<span>Sort: Next Due</span>
</button>
<button class="px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs font-label font-medium flex items-center gap-1.5 transition-colors">
<span class="material-symbols-outlined text-[16px]">tune</span>
<span>FSRS Tuning</span>
</button>
<button class="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors" title="Export Deck Anki/CSV">
<span class="material-symbols-outlined text-[18px]">file_upload</span>
</button>
</div>
</div>
<!-- Type Badges Filter Bar -->
<div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-label">
<button class="px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-semibold shadow-sm shrink-0">
          All (142)
        </button>
<button class="px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-medium transition-colors shrink-0">
          Cloze Deletion (64)
        </button>
<button class="px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-medium transition-colors shrink-0">
          Concept Comparison (38)
        </button>
<button class="px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-medium transition-colors shrink-0">
          LaTeX Proofs (24)
        </button>
<button class="px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-medium transition-colors shrink-0">
          Image Occlusion (16)
        </button>
</div>
</div>
<!-- Main Workspace Split: Flashcard Vault Grid + Side Inspector Preview -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
<!-- Cards List / Grid (8 Cols) -->
<div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
<!-- Flashcard 1 (BOCC) - Active Selected -->
<div class="p-6 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer shadow-[0_2px_16px_rgba(58,48,42,0.04)] ring-2 ring-primary/60 flex flex-col gap-4">
<div class="flex items-center justify-between gap-4">
<div class="flex items-center gap-2">
<span class="text-[11px] font-label font-bold px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">CS-402</span>
<span class="text-[11px] font-label font-medium px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">Concept Comparison</span>
<span class="text-[10px] font-label font-mono text-outline">ID: #402-CC-89</span>
</div>
<div class="flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-primary"></span>
<span class="text-xs font-label font-bold text-primary">Review Ready</span>
</div>
</div>
<div class="flex flex-col gap-1.5">
<h3 class="font-headline text-2xl font-semibold text-on-surface leading-snug">
              What are the 3 validation conditions for Backward Oriented Concurrency Control (BOCC)?
            </h3>
<p class="font-body text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
              Answer requires evaluating active concurrent write sets vs read set of $T_k$. 1) $WS(T_i) \cap RS(T_k) = \emptyset$, 2) Serialization order preservation, 3) Write-commit phase containment.
            </p>
</div>
<!-- Card Metrics Matrix Strip -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-xl bg-surface-container-lowest shadow-sm">
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Stability (S)</span>
<span class="text-xs font-label font-bold text-on-surface">14.2 days</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Difficulty (D)</span>
<span class="text-xs font-label font-bold text-tertiary">0.42 (Moderate)</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Next Review</span>
<span class="text-xs font-label font-bold text-primary">In 3 days</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Repetitions</span>
<span class="text-xs font-label font-bold text-on-surface">6 reviews</span>
</div>
</div>
<div class="flex items-center justify-between pt-1">
<div class="flex items-center gap-2 text-xs font-label text-on-surface-variant">
<span class="material-symbols-outlined text-[16px] text-outline">auto_stories</span>
<span>Source: Silberschatz Chapter 19, p. 714</span>
</div>
<div class="flex items-center gap-2">
<button class="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-label font-medium text-on-surface transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">flip</span> Flip
              </button>
<button class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Edit Card">
<span class="material-symbols-outlined text-[18px]">edit_note</span>
</button>
<button class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Archive Card">
<span class="material-symbols-outlined text-[18px]">archive</span>
</button>
</div>
</div>
</div>
<!-- Flashcard 2 (Spectral Theorem) -->
<div class="p-6 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col gap-4">
<div class="flex items-center justify-between gap-4">
<div class="flex items-center gap-2">
<span class="text-[11px] font-label font-bold px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed uppercase tracking-wider">MATH-301</span>
<span class="text-[11px] font-label font-medium px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">LaTeX Formula</span>
<span class="text-[10px] font-label font-mono text-outline">ID: #301-LX-12</span>
</div>
<div class="flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-primary/80"></span>
<span class="text-xs font-label font-bold text-on-surface">Mastered</span>
</div>
</div>
<div class="flex flex-col gap-1.5">
<h3 class="font-headline text-2xl font-semibold text-on-surface leading-snug">
              State the Spectral Theorem for real symmetric matrices $A = Q \Lambda Q^T$.
            </h3>
<p class="font-body text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
              Every real symmetric matrix $A \in \mathbb{R}^{n \times n}$ has $n$ real eigenvalues and an orthonormal basis of eigenvectors such that $A = \sum_{i=1}^n \lambda_i q_i q_i^T$.
            </p>
</div>
<!-- Card Metrics Matrix Strip -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-xl bg-surface-container-lowest shadow-sm">
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Stability (S)</span>
<span class="text-xs font-label font-bold text-on-surface">45.0 days</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Difficulty (D)</span>
<span class="text-xs font-label font-bold text-on-surface">0.28 (Easy)</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Next Review</span>
<span class="text-xs font-label font-bold text-on-surface">In 18 days</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Repetitions</span>
<span class="text-xs font-label font-bold text-on-surface">11 reviews</span>
</div>
</div>
<div class="flex items-center justify-between pt-1">
<div class="flex items-center gap-2 text-xs font-label text-on-surface-variant">
<span class="material-symbols-outlined text-[16px] text-outline">auto_stories</span>
<span>Source: Strang Linear Algebra p. 348</span>
</div>
<div class="flex items-center gap-2">
<button class="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-label font-medium text-on-surface transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">flip</span> Flip
              </button>
<button class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[18px]">edit_note</span>
</button>
<button class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[18px]">archive</span>
</button>
</div>
</div>
</div>
<!-- Flashcard 3 (GPCR vs RTK) -->
<div class="p-6 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col gap-4">
<div class="flex items-center justify-between gap-4">
<div class="flex items-center gap-2">
<span class="text-[11px] font-label font-bold px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed uppercase tracking-wider">BIO-210</span>
<span class="text-[11px] font-label font-medium px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">Concept Comparison</span>
<span class="text-[10px] font-label font-mono text-outline">ID: #210-CP-43</span>
</div>
<div class="flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-primary-container"></span>
<span class="text-xs font-label font-bold text-on-surface">Scheduled</span>
</div>
</div>
<div class="flex flex-col gap-1.5">
<h3 class="font-headline text-2xl font-semibold text-on-surface leading-snug">
              Distinguish between G-Protein Coupled Receptors (GPCR) and Receptor Tyrosine Kinases (RTK).
            </h3>
<p class="font-body text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
              GPCRs act via 7-transmembrane domains coupled to heterotrimeric G-proteins producing cAMP/IP3. RTKs dimerize upon ligand binding and autophosphorylate tyrosine residues directly.
            </p>
</div>
<!-- Card Metrics Matrix Strip -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-xl bg-surface-container-lowest shadow-sm">
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Stability (S)</span>
<span class="text-xs font-label font-bold text-on-surface">8.5 days</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Difficulty (D)</span>
<span class="text-xs font-label font-bold text-tertiary">0.54 (Hard)</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Next Review</span>
<span class="text-xs font-label font-bold text-primary">Tomorrow</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Repetitions</span>
<span class="text-xs font-label font-bold text-on-surface">4 reviews</span>
</div>
</div>
<div class="flex items-center justify-between pt-1">
<div class="flex items-center gap-2 text-xs font-label text-on-surface-variant">
<span class="material-symbols-outlined text-[16px] text-outline">auto_stories</span>
<span>Source: Alberts Cell Biology Ch 16, Fig 16-18</span>
</div>
<div class="flex items-center gap-2">
<button class="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-label font-medium text-on-surface transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">flip</span> Flip
              </button>
<button class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[18px]">edit_note</span>
</button>
<button class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[18px]">archive</span>
</button>
</div>
</div>
</div>
<!-- Flashcard 4 (FOCC Cloze - Urgent) -->
<div class="p-6 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col gap-4">
<div class="flex items-center justify-between gap-4">
<div class="flex items-center gap-2">
<span class="text-[11px] font-label font-bold px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">CS-402</span>
<span class="text-[11px] font-label font-medium px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">Cloze Deletion</span>
<span class="text-[10px] font-label font-mono text-outline">ID: #402-CL-19</span>
</div>
<div class="flex items-center gap-1.5 px-2 py-0.5 rounded bg-tertiary/15 text-tertiary">
<span class="material-symbols-outlined text-[14px]">warning</span>
<span class="text-xs font-label font-bold">Due Today (Urgent)</span>
</div>
</div>
<div class="flex flex-col gap-1.5">
<h3 class="font-headline text-2xl font-semibold text-on-surface leading-snug">
              In FOCC, when does conflict validation occur relative to the commit phase?
            </h3>
<p class="font-body text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
              Forward Oriented Concurrency Control verifies whether the writing set of current transaction intersects with the read set of <span class="bg-primary/20 text-primary font-mono px-1 rounded">[...parallel active...]</span> transactions prior to commit.
            </p>
</div>
<!-- Card Metrics Matrix Strip -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-xl bg-surface-container-lowest shadow-sm">
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Stability (S)</span>
<span class="text-xs font-label font-bold text-tertiary">1.2 days</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Difficulty (D)</span>
<span class="text-xs font-label font-bold text-tertiary">0.68 (Critical)</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Next Review</span>
<span class="text-xs font-label font-bold text-tertiary">Overdue (-4h)</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label font-medium uppercase text-outline">Repetitions</span>
<span class="text-xs font-label font-bold text-on-surface">2 reviews</span>
</div>
</div>
<div class="flex items-center justify-between pt-1">
<div class="flex items-center gap-2 text-xs font-label text-on-surface-variant">
<span class="material-symbols-outlined text-[16px] text-outline">auto_stories</span>
<span>Source: Lecture 14 Slide 22</span>
</div>
<div class="flex items-center gap-2">
<button class="px-3 py-1.5 rounded-lg bg-tertiary text-on-tertiary hover:bg-tertiary/90 text-xs font-label font-semibold transition-colors flex items-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-[16px]">play_circle</span> Review Now
              </button>
<button class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[18px]">edit_note</span>
</button>
<button class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[18px]">archive</span>
</button>
</div>
</div>
</div>
</div>
<!-- Card Detail Preview Drawer / Side Inspector (4-5 Cols Sticky) -->
<div class="lg:col-span-5 xl:col-span-4 sticky top-20 flex flex-col gap-6">
<!-- Inspector Card Container -->
<div class="p-6 rounded-2xl bg-surface-container-low shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col gap-6">
<div class="flex items-center justify-between pb-3">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[20px]">layers</span>
<h2 class="font-headline text-xl font-bold text-on-surface">Card Detail Inspector</h2>
</div>
<span class="text-[11px] font-label font-semibold text-primary bg-primary-fixed px-2 py-0.5 rounded">Active Focus</span>
</div>
<!-- Flip Card Visualizer -->
<div class="flex flex-col gap-2">
<div class="flex items-center justify-between text-xs font-label text-on-surface-variant">
<span class="uppercase tracking-wider font-semibold">Card Face: Front &amp; Back</span>
<span class="text-[11px] text-outline">Click tab to preview flip</span>
</div>
<div class="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4">
<div class="flex items-center justify-between">
<span class="text-[10px] font-label uppercase tracking-widest text-primary font-bold">Prompt / Stimulus</span>
<span class="material-symbols-outlined text-[16px] text-outline">psychology</span>
</div>
<p class="font-headline text-lg font-medium text-on-surface leading-snug">
                What are the 3 validation conditions for Backward Oriented Concurrency Control (BOCC)?
              </p>
<div class="pt-3 flex flex-col gap-2">
<div class="flex items-center justify-between">
<span class="text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">Revealed Solution</span>
<span class="text-[10px] font-label bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded">LaTeX Rendered</span>
</div>
<div class="text-xs font-body text-on-surface bg-surface-container-low p-3.5 rounded-lg flex flex-col gap-2 leading-relaxed">
<p><strong class="font-semibold text-primary">Condition 1:</strong> For all $T_i$ committed before $T_k$ starts: validated naturally.</p>
<p><strong class="font-semibold text-primary">Condition 2:</strong> For all $T_i$ committed while $T_k$ is active: verify that $\text{WriteSet}(T_i) \cap \text{ReadSet}(T_k) = \emptyset$.</p>
<p><strong class="font-semibold text-primary">Condition 3:</strong> $T_i$ completes writing before $T_k$ starts its validation phase.</p>
</div>
</div>
</div>
</div>
<!-- Academic Citation Source -->
<div class="p-4 rounded-xl bg-surface-container flex items-start gap-3">
<div class="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0 mt-0.5">
<span class="material-symbols-outlined text-[18px]">bookmark</span>
</div>
<div class="flex flex-col">
<span class="text-[11px] font-label font-bold text-on-surface">Primary Citation</span>
<p class="text-xs font-body text-on-surface-variant mt-0.5">
                Silberschatz, Korth, Sudarshan. <em>Database System Concepts</em> (7th Ed.), Chapter 19: Concurrency Control, §19.5, p. 714.
              </p>
</div>
</div>
<!-- FSRS Stability History Graph (Inline SVG Data Viz) -->
<div class="flex flex-col gap-3">
<div class="flex items-center justify-between">
<span class="text-xs font-label uppercase tracking-wider font-semibold text-on-surface-variant">FSRS Stability &amp; Memory Decay</span>
<span class="text-xs font-mono font-semibold text-primary">R = e^(-t/14.2)</span>
</div>
<div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
<!-- SVG Retention Curve Under 2KB -->
<svg class="w-full h-28 text-primary overflow-visible" viewbox="0 0 320 110">
<defs>
<lineargradient id="curveGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#c2652a" stop-opacity="0.25"></stop>
<stop offset="100%" stop-color="#c2652a" stop-opacity="0.0"></stop>
</lineargradient>
</defs>
<!-- Grid guide lines -->
<line opacity="0.6" stroke="#d8d0c8" stroke-dasharray="3,3" stroke-width="0.75" x1="20" x2="310" y1="15" y2="15"></line>
<line opacity="0.6" stroke="#d8d0c8" stroke-dasharray="3,3" stroke-width="0.75" x1="20" x2="310" y1="50" y2="50"></line>
<line opacity="0.6" stroke="#d8d0c8" stroke-dasharray="3,3" stroke-width="0.75" x1="20" x2="310" y1="85" y2="85"></line>
<!-- Axis Labels -->
<text fill="#9a9088" font-family="Manrope" font-size="8" x="5" y="18">100%</text>
<text fill="#9a9088" font-family="Manrope" font-size="8" x="5" y="53">90%</text>
<text fill="#9a9088" font-family="Manrope" font-size="8" x="5" y="88">75%</text>
<!-- Target line 90% -->
<line opacity="0.7" stroke="#c2652a" stroke-dasharray="2,2" stroke-width="1" x1="25" x2="310" y1="50" y2="50"></line>
<!-- Area fill below curve -->
<path d="M 25 15 Q 120 25 210 50 T 310 75 L 310 100 L 25 100 Z" fill="url(#curveGradient)"></path>
<!-- Main Retention Curve -->
<path d="M 25 15 Q 120 25 210 50 T 310 75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.2"></path>
<!-- Review Points Dots -->
<circle cx="25" cy="15" fill="#faf5ee" r="3.5" stroke="#c2652a" stroke-width="2"></circle>
<circle cx="110" cy="28" fill="#faf5ee" r="3.5" stroke="#c2652a" stroke-width="2"></circle>
<circle cx="210" cy="50" fill="#c2652a" r="4.5" stroke="#faf5ee" stroke-width="1.5"></circle>
<circle cx="310" cy="75" fill="#d8d0c8" r="3"></circle>
<!-- Pointer Marker at Day 14 -->
<text fill="#c2652a" font-family="Manrope" font-size="9" font-weight="bold" x="200" y="42">Next Due (90%)</text>
</svg>
<div class="flex items-center justify-between text-[11px] font-label text-on-surface-variant pt-1">
<span>Day 0 (Initial)</span>
<span>Day 4 (Rev 1)</span>
<span class="text-primary font-bold">Day 14.2 (Target)</span>
<span>Day 30</span>
</div>
</div>
</div>
<!-- Review Interval Logs -->
<div class="flex flex-col gap-2.5">
<span class="text-xs font-label uppercase tracking-wider font-semibold text-on-surface-variant">FSRS Log Stream</span>
<div class="flex flex-col gap-2 text-xs font-label">
<div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-container">
<div class="flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span class="font-medium text-on-surface">Rating: Good (3)</span>
</div>
<span class="text-on-surface-variant font-mono text-[11px]">S: 14.2d | D: 0.42</span>
<span class="text-outline text-[11px]">Oct 18</span>
</div>
<div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-container">
<div class="flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span class="font-medium text-on-surface">Rating: Easy (4)</span>
</div>
<span class="text-on-surface-variant font-mono text-[11px]">S: 6.8d | D: 0.45</span>
<span class="text-outline text-[11px]">Oct 04</span>
</div>
<div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-container">
<div class="flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
<span class="font-medium text-on-surface">Rating: Hard (2)</span>
</div>
<span class="text-on-surface-variant font-mono text-[11px]">S: 2.1d | D: 0.50</span>
<span class="text-outline text-[11px]">Sep 27</span>
</div>
</div>
</div>
<!-- Footer Actions in Inspector -->
<div class="pt-2 flex items-center gap-3">
<button class="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-label font-bold shadow-sm hover:bg-primary/90 transition-all text-center">
              Practice This Concept
            </button>
<button class="px-3 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-label font-semibold transition-colors" title="Deep Diagnostic">
<span class="material-symbols-outlined text-[18px]">analytics</span>
</button>
</div>
</div>
<!-- Curated Study Deck Summary Pill -->
<div class="p-5 rounded-2xl bg-surface-container-low shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[20px]">psychology</span>
</div>
<div class="flex flex-col">
<span class="text-xs font-bold text-on-surface font-label">FSRS Calibration</span>
<span class="text-[11px] text-on-surface-variant font-body">Optimized for 90% Retention Rate</span>
</div>
</div>
<button class="text-xs font-label font-bold text-primary hover:underline">Settings</button>
</div>
</div>
</div>
</div>
</div>
<script>
  // Simple micro-interactions for generator toggling
  const generatorPanel = document.getElementById('ai-generator-panel');
  const closeBtn = document.getElementById('close-generator-btn');
  const openBtn = document.getElementById('open-generator-btn');

  let isCollapsed = false;

  closeBtn?.addEventListener('click', () => {
    isCollapsed = true;
    generatorPanel.classList.add('hidden');
  });

  openBtn?.addEventListener('click', () => {
    if (generatorPanel.classList.contains('hidden')) {
      generatorPanel.classList.remove('hidden');
      generatorPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      generatorPanel.querySelector('textarea')?.focus();
    }
  });
</script></main></div></body></html>

<!-- StudyTantra - Desktop Auth Portal (Sahara Edition) -->
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_standard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;family=Manrope:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "tertiary": "#8c3c3c", "on-surface": "#3a302a", "error": "#c0392b", "surface": "#faf5ee", "secondary-fixed": "#eae2da", "on-tertiary": "#ffffff", "on-background": "#3a302a", "outline": "#9a9088", "tertiary-container": "#d47070", "primary-fixed-dim": "#f0a878", "surface-bright": "#faf5ee", "surface-variant": "#ece6dc", "tertiary-fixed-dim": "#e8a0a0", "on-secondary": "#ffffff", "secondary-fixed-dim": "#cec6be", "surface-container-low": "#f6f0e8", "primary-container": "#e08850", "surface-dim": "#dcd6cc", "primary-fixed": "#fbe8d8", "on-error": "#ffffff", "surface-container": "#f2ece4", "on-tertiary-fixed-variant": "#6e3030", "surface-container-lowest": "#ffffff", "on-primary-container": "#fbe8d8", "secondary": "#78706a", "surface-container-highest": "#e6e0d6", "outline-variant": "#d8d0c8", "secondary-container": "#eae2da", "on-primary-fixed": "#401a08", "error-container": "#fce4e0", "on-secondary-fixed-variant": "#504840", "on-tertiary-container": "#3a2020", "inverse-primary": "#f0a878", "inverse-surface": "#3a302a", "on-tertiary-fixed": "#2e1515", "tertiary-fixed": "#fce0e0", "on-primary-fixed-variant": "#8a4518", "on-primary": "#ffffff", "surface-container-high": "#ece6dc", "background": "#faf5ee", "on-secondary-fixed": "#2a2420", "on-secondary-container": "#605850", "surface-tint": "#c2652a", "primary": "#c2652a", "on-error-container": "#7a1a10", "inverse-on-surface": "#faf5ee", "on-surface-variant": "#605850" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": {}, "fontFamily": { "headline": [ "EB Garamond" ], "display": [ "EB Garamond" ], "body": [ "Manrope" ], "label": [ "Manrope" ] }, "fontSize": {} } } }</script></head><body class="bg-background font-body text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed"><header class="w-full border-b border-outline-variant/40 bg-surface/85 backdrop-blur-md sticky top-0 z-30"><div class="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm"><span class="material-symbols-outlined text-xl">local_fire_department</span></div><div class="flex items-baseline gap-2"><span class="font-headline text-2xl font-bold tracking-tight text-on-surface leading-none">StudyTantra</span><span class="text-[10px] font-label font-bold uppercase tracking-wider text-primary bg-primary-fixed px-1.5 py-0.5 rounded">Sahara</span></div></div><div class="flex items-center gap-6"><nav class="hidden md:flex items-center gap-6 text-sm font-medium" data-active-classes="text-primary font-semibold"><a class="text-on-surface-variant hover:text-primary transition-colors" data-path="dashboard" href="#">Dashboard</a><a aria-current="page" class="transition-colors text-primary font-semibold" data-path="auth-onboarding" href="#">Account Portal</a></nav><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"><span class="material-symbols-outlined text-[18px]">verified_user</span></div></div></div></div></header><main class="relative pt-16 flex-1 w-full bg-background"><div class="flex flex-col w-full">
<div class="relative w-full overflow-hidden">
<!-- Subtle Ambient Glow Orbs -->
<div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none"></div>
<div class="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none"></div>
<div class="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 lg:py-16">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
<!-- Left Pane: 55% Brand & Academic Showcase (7 cols) -->
<section class="lg:col-span-7 flex flex-col pt-2 lg:pr-6">
<!-- Monospaced Section Marker & Category -->
<div class="flex items-center gap-3 mb-6">
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label text-xs font-semibold tracking-wider uppercase">
<span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Cognitive OS v4.5
            </span>
<span class="text-xs font-label text-outline uppercase tracking-widest font-medium">01 // Academic Portal</span>
</div>
<!-- Hero Editorial Headline -->
<h1 class="font-headline text-4xl sm:text-5xl lg:text-6xl text-on-surface font-semibold tracking-tight leading-[1.08] mb-6">
            Retain More. <br class="hidden sm:inline"/>
<span class="italic font-normal text-primary">Cram Less.</span> Master <br class="hidden sm:inline"/>
            University Finals.
          </h1>
<!-- Compelling Narrative Subtitle -->
<p class="text-base sm:text-lg text-on-surface-variant font-body leading-relaxed max-w-2xl mb-10">
            Turn dense 600-page syllabi, research papers, and lecture recordings into high-retention active recall vaults with algorithmic FSRS spacing tuned for cognitive resilience.
          </p>
<!-- Asymmetric Visual Showcase / Academic Proof Cards -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
<!-- Value Card 1 -->
<div class="group relative bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
<div class="mb-4">
<div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
<span class="material-symbols-outlined text-2xl">auto_stories</span>
</div>
<span class="text-[11px] font-label font-bold tracking-widest uppercase text-tertiary">Ingest Module</span>
<h3 class="font-headline text-lg text-on-surface font-semibold leading-snug mt-1 mb-2">Smart PDF &amp; Lecture Ingestion</h3>
<p class="text-xs text-on-surface-variant leading-relaxed">Turn multi-gigabyte course drives into structured active recall decks in seconds.</p>
</div>
<div class="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-[11px] font-label text-primary font-semibold">
<span>PDF • PPTX • MP4</span>
<span class="material-symbols-outlined text-sm">arrow_forward</span>
</div>
</div>
<!-- Value Card 2 (Accented) -->
<div class="group relative bg-surface-container rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
<div class="mb-4">
<div class="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm">
<span class="material-symbols-outlined text-2xl">query_stats</span>
</div>
<span class="text-[11px] font-label font-bold tracking-widest uppercase text-primary">Algorithmic Engine</span>
<h3 class="font-headline text-lg text-on-surface font-semibold leading-snug mt-1 mb-2">FSRS-4.5 Algorithmic Recall</h3>
<p class="text-xs text-on-surface-variant leading-relaxed">Proven mathematical memory stabilization calibrated against cognitive fatigue patterns.</p>
</div>
<!-- Small Inline Recall Decay Sparkline -->
<div class="pt-2">
<svg class="w-full h-8 text-primary overflow-visible" fill="none" viewbox="0 0 160 32">
<path d="M0 4 C 30 5, 50 14, 80 16 C 110 18, 130 26, 160 28" stroke="currentColor" stroke-linecap="round" stroke-width="2"></path>
<circle class="fill-primary" cx="80" cy="16" r="3"></circle>
<circle class="fill-primary" cx="160" cy="28" r="3"></circle>
</svg>
<div class="flex justify-between text-[10px] text-outline font-label mt-1">
<span>Day 1: 100%</span>
<span>Target: 90%</span>
</div>
</div>
</div>
<!-- Value Card 3 -->
<div class="group relative bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
<div class="mb-4">
<div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
<span class="material-symbols-outlined text-2xl">verified</span>
</div>
<span class="text-[11px] font-label font-bold tracking-widest uppercase text-tertiary">Hallucination Free</span>
<h3 class="font-headline text-lg text-on-surface font-semibold leading-snug mt-1 mb-2">Grounded Source Citations</h3>
<p class="text-xs text-on-surface-variant leading-relaxed">Every flashcard and quiz item links directly to exact textbook and slide proofs.</p>
</div>
<div class="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-[11px] font-label text-on-surface-variant">
<span class="font-mono text-[10px] bg-surface-container px-2 py-0.5 rounded">p. 342 § 4.2</span>
<span class="text-tertiary font-semibold">100% Proven</span>
</div>
</div>
</div>
<!-- Academic Social Proof & Retention Metrics Banner -->
<div class="relative bg-surface-container-high/60 backdrop-blur-sm rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
<div class="flex items-center gap-4">
<!-- Visual Student/Researcher Avatars -->
<div class="flex -space-x-3 overflow-hidden">
<img class="inline-block h-11 w-11 rounded-full ring-2 ring-surface object-cover" data-alt="A portrait photograph of a young Indian university research scholar wearing spectacles in a warm sunlit library, holding an open notebook, natural golden tones, warm linen atmosphere." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2PGKO_luKvu3rHQlSriALlCJaI7aSPIjB1MoaOiLxLgxDAjVQhoQJeYziICxetiKThQJGu6obFxLl8ZE9O4ql3uw_ItJcf8CeyQ6kko_p18AFjY7sl1qvaPgqHDzWejCbs3x4IhmroSbWyYe2afc-YuLR5MaTr4Qivkd_37lfH_icFOS2xVuk97tY51kUysq9M8eoszzlZdCVdGwlV04jW5nWEJAPqw-VblfRd_BY"/>
<img class="inline-block h-11 w-11 rounded-full ring-2 ring-surface object-cover" data-alt="A candid documentary style portrait of a female computer science student smiling thoughtfully in an academic seminar room with warm terracotta woodwork in the background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ6Odrakh2lrOn1exdzqFiX4qFfXn8UhRcm8Q1MBBZ8SNj086JJLUj3cF0T38WnrVjOPO5Q3gToRnwNnOHzm0KLxOZRwqlghX2luS5WyXNCgSqEfQ_TU6QrGUkHveZxiTiAk12HCGyjlYlrvuDL775MQwPiMgRRksL3ofBufkZ9wgM6UXxfL23LGiIuL2qrtQZE6sT3rN7i0vXZUoiOnePh2tqyskxFfXs-s2cBj3b"/>
<img class="inline-block h-11 w-11 rounded-full ring-2 ring-surface object-cover" data-alt="A distinguished academic scholar in an amber-lit university quadrangle reviewing study materials on an e-reader with architectural stone archways." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYqIOZGqa1fkVAaUtTDupQFPwmIVp5Uf60Ehhi8l8pcBGamOneT9bTbRvXzXz2E4WWkz0wRvTS61lMHjlV2KoBrPkmTg8zM8LcX1LkAdIysdTCLDATe3TjkXsVObGWjkn73EMEpK9ntq3rArrtnjpZlPFZHcoM7dvRjtrzOGonyKfXJJ5ypLZdhUiYoLZ5-HEpQ_NF9b4_n9DxBXRJgqbcbD-j-aCGUlhjnc_2oGdV"/>
</div>
<div>
<div class="flex items-center gap-1.5 text-primary text-xs font-label font-bold">
<span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">star</span>
<span>91.4% Long-Term Retention</span>
</div>
<p class="text-xs text-on-surface font-medium mt-0.5">
                  Trusted across <span class="font-semibold text-on-surface">MIT, Stanford, IIT Bombay</span> &amp; <span class="font-semibold text-on-surface">Cambridge</span>
</p>
</div>
</div>
<!-- FSRS Metric Tag -->
<div class="flex items-center gap-3 bg-surface-container-lowest px-4 py-2.5 rounded-lg shadow-sm w-full sm:w-auto justify-center">
<span class="material-symbols-outlined text-primary text-xl">psychology</span>
<div class="text-left">
<span class="block text-[10px] uppercase font-label tracking-wider text-outline font-semibold">Review Pace</span>
<span class="block text-sm font-label font-bold text-on-surface">3.4x Faster Mastery</span>
</div>
</div>
</div>
<!-- Bottom Editorial Quote Marker -->
<div class="mt-8 flex items-center gap-4 text-xs text-secondary font-label">
<span class="text-primary font-headline text-2xl font-bold">“</span>
<span class="italic max-w-lg">“StudyTantra replaced four fragmented study apps. The FSRS decay curves are eerily accurate for pharmacology boards.”</span>
</div>
</section>
<!-- Right Pane: 45% Authentication & Onboarding Card (5 cols) -->
<section class="lg:col-span-5 w-full">
<div class="relative bg-surface-container-lowest rounded-2xl p-7 sm:p-10 shadow-lg shadow-on-surface/5">
<!-- Soft Accent Trim Top Line -->
<div class="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-60"></div>
<!-- Header Titles -->
<div class="mb-7">
<div class="flex items-center justify-between mb-2">
<span class="inline-flex items-center gap-1.5 text-[11px] font-label font-bold tracking-widest uppercase text-primary">
<span class="material-symbols-outlined text-sm">lock_open</span> Secure Entry
                </span>
<span class="text-[11px] font-label text-outline">Session: 256-bit AES</span>
</div>
<h2 class="font-headline text-3xl font-semibold text-on-surface tracking-tight leading-tight">
                Access Your Study Vault
              </h2>
<p class="text-xs sm:text-sm text-on-surface-variant font-body mt-1.5 leading-relaxed">
                Sign in with your institutional credentials to sync your active FSRS review queues.
              </p>
</div>
<!-- Primary Action: Institutional SSO Button -->
<div class="space-y-3 mb-6">
<button class="group w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label text-sm font-semibold transition-all duration-200 shadow-sm active:scale-[0.99]" type="button">
<!-- University SSO Google Icon SVG -->
<svg class="w-4 h-4 shrink-0" viewbox="0 0 24 24">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
</svg>
<span>Continue with University SSO (Google Workspace)</span>
</button>
<!-- Alternative SSO Row -->
<div class="grid grid-cols-2 gap-3">
<button class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label text-xs font-semibold transition-colors duration-150" type="button">
<span class="material-symbols-outlined text-[18px] text-on-surface-variant">terminal</span>
<span>GitHub Student</span>
</button>
<button class="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label text-xs font-semibold transition-colors duration-150" type="button">
<span class="material-symbols-outlined text-[18px] text-tertiary">school</span>
<span>Canvas LMS</span>
</button>
</div>
</div>
<!-- Divider with Editorial Flourish -->
<div class="relative my-7 flex items-center justify-center">
<div class="w-full h-px bg-outline-variant/50"></div>
<span class="absolute bg-surface-container-lowest px-3 text-[11px] font-label uppercase tracking-widest text-outline">or sign in with campus email</span>
</div>
<!-- Standard Auth Form -->
<form class="space-y-4" id="vault-auth-form" onsubmit="event.preventDefault(); handleAuthSubmit();">
<!-- Institutional Email Input -->
<div>
<div class="flex items-center justify-between mb-1.5">
<label class="block text-xs font-label font-semibold text-on-surface tracking-wide" for="campus-email">
                    Institutional Email
                  </label>
<span class="text-[10px] font-label text-tertiary font-semibold flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span> .edu / .ac.in / ac.uk
                  </span>
</div>
<div class="relative rounded-lg shadow-sm">
<div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
<span class="material-symbols-outlined text-lg">alternate_email</span>
</div>
<input class="block w-full pl-10 pr-24 py-3 bg-surface-container-lowest text-on-surface placeholder-outline/70 text-sm rounded-lg border-0 ring-1 ring-outline-variant/60 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" id="campus-email" placeholder="student@iitb.ac.in" required="" type="email" value="arjun.patel@iitb.ac.in"/>
<div class="absolute inset-y-0 right-0 pr-3 flex items-center">
<span class="inline-flex items-center gap-1 text-[10px] font-label font-bold bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded">
<span class="material-symbols-outlined text-[12px]">verified</span> IITB
                    </span>
</div>
</div>
</div>
<!-- Password Input -->
<div>
<div class="flex items-center justify-between mb-1.5">
<label class="block text-xs font-label font-semibold text-on-surface tracking-wide" for="vault-pass">
                    Password
                  </label>
<a class="text-xs font-label text-primary hover:underline font-medium" href="#">Forgot password?</a>
</div>
<div class="relative rounded-lg shadow-sm">
<div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
<span class="material-symbols-outlined text-lg">key</span>
</div>
<input class="block w-full pl-10 pr-10 py-3 bg-surface-container-lowest text-on-surface placeholder-outline/70 text-sm rounded-lg border-0 ring-1 ring-outline-variant/60 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" id="vault-pass" placeholder="Enter your security phrase" required="" type="password" value="CognitiveMemory2025#"/>
<button aria-label="Toggle password visibility" class="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface focus:outline-none" id="toggle-pass-btn" onclick="togglePasswordVisibility()" type="button">
<span class="material-symbols-outlined text-lg" id="pass-eye-icon">visibility</span>
</button>
</div>
</div>
<!-- Remember Device Checkbox -->
<div class="flex items-center justify-between pt-1">
<label class="flex items-center gap-2 cursor-pointer select-none">
<input checked="" class="w-4 h-4 rounded text-primary bg-surface-container focus:ring-primary focus:ring-offset-0 border-0" type="checkbox"/>
<span class="text-xs font-label text-on-surface-variant font-medium">Remember this device for 30 days</span>
</label>
<span class="text-[11px] font-label text-outline">FSRS Cloud Sync</span>
</div>
<!-- Primary Submit CTA -->
<button class="w-full mt-2 py-3.5 px-6 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-label text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.99] group" id="submit-btn" type="submit">
<span>Enter Workspace</span>
<span class="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
</button>
</form>
<!-- Campus Account Enrollment Link -->
<div class="mt-6 pt-5 border-t border-outline-variant/30 text-center">
<p class="text-xs font-label text-on-surface-variant">
                New to StudyTantra?
                <a class="text-primary font-bold hover:underline ml-1" href="#">Create an academic account →</a>
</p>
<p class="text-[11px] font-label text-outline mt-1 font-medium">Free 50GB ingestion quota for university students</p>
</div>
<!-- Bottom FERPA / Encrypted Trust Badge -->
<div class="mt-6 bg-surface-container-low/70 rounded-lg p-3 flex items-center justify-center gap-2 text-[11px] font-label text-on-surface-variant">
<span class="material-symbols-outlined text-sm text-tertiary">lock</span>
<span>End-to-End Encrypted • FERPA &amp; Academic Data Privacy Compliant</span>
</div>
</div>
<!-- Quick Campus Support Hotline Link -->
<div class="mt-4 px-2 flex items-center justify-between text-xs font-label text-secondary">
<span class="flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-emerald-600"></span>
              All API Services Normal
            </span>
<a class="hover:text-primary transition-colors flex items-center gap-1" href="#">
<span>Campus IT Helpdesk</span>
<span class="material-symbols-outlined text-xs">open_in_new</span>
</a>
</div>
</section>
</div>
</div>
</div>
</div>
<script>
  function togglePasswordVisibility() {
    var passInput = document.getElementById('vault-pass');
    var eyeIcon = document.getElementById('pass-eye-icon');
    if (!passInput || !eyeIcon) return;

    if (passInput.type === 'password') {
      passInput.type = 'text';
      eyeIcon.textContent = 'visibility_off';
    } else {
      passInput.type = 'password';
      eyeIcon.textContent = 'visibility';
    }
  }

  function handleAuthSubmit() {
    var btn = document.getElementById('submit-btn');
    if (!btn) return;
    var originalHTML = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined text-lg animate-spin">progress_activity</span><span>Verifying Credentials...</span>';
    
    setTimeout(function() {
      btn.innerHTML = '<span class="material-symbols-outlined text-lg text-on-primary">check_circle</span><span>Authenticated! Opening Vault...</span>';
      setTimeout(function() {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }, 1800);
    }, 1200);
  }
</script></main><footer class="w-full border-t border-outline-variant/40 bg-surface-container-low py-4 text-center text-xs text-on-surface-variant font-label"><div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3"><span>© 2025 StudyTantra. Sun-Baked Simplicity &amp; AI Spaced Recall.</span><div class="flex items-center gap-5"><a class="hover:text-primary transition-colors" href="#">Institutional Access</a><a class="hover:text-primary transition-colors" href="#">Privacy &amp; FERPA</a><a class="hover:text-primary transition-colors" href="#">System Status</a></div></div></footer></body></html>

<!-- StudyTantra - Collection Workspace CS-402 (Sahara Edition) -->
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;family=Manrope:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "tertiary": "#8c3c3c", "on-surface": "#3a302a", "error": "#c0392b", "surface": "#faf5ee", "secondary-fixed": "#eae2da", "on-tertiary": "#ffffff", "on-background": "#3a302a", "outline": "#9a9088", "tertiary-container": "#d47070", "primary-fixed-dim": "#f0a878", "surface-bright": "#faf5ee", "surface-variant": "#ece6dc", "tertiary-fixed-dim": "#e8a0a0", "on-secondary": "#ffffff", "secondary-fixed-dim": "#cec6be", "surface-container-low": "#f6f0e8", "primary-container": "#e08850", "surface-dim": "#dcd6cc", "primary-fixed": "#fbe8d8", "on-error": "#ffffff", "surface-container": "#f2ece4", "on-tertiary-fixed-variant": "#6e3030", "surface-container-lowest": "#ffffff", "on-primary-container": "#fbe8d8", "secondary": "#78706a", "surface-container-highest": "#e6e0d6", "outline-variant": "#d8d0c8", "secondary-container": "#eae2da", "on-primary-fixed": "#401a08", "error-container": "#fce4e0", "on-secondary-fixed-variant": "#504840", "on-tertiary-container": "#3a2020", "inverse-primary": "#f0a878", "inverse-surface": "#3a302a", "on-tertiary-fixed": "#2e1515", "tertiary-fixed": "#fce0e0", "on-primary-fixed-variant": "#8a4518", "on-primary": "#ffffff", "surface-container-high": "#ece6dc", "background": "#faf5ee", "on-secondary-fixed": "#2a2420", "on-secondary-container": "#605850", "surface-tint": "#c2652a", "primary": "#c2652a", "on-error-container": "#7a1a10", "inverse-on-surface": "#faf5ee", "on-surface-variant": "#605850" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": {}, "fontFamily": { "headline": [ "EB Garamond" ], "display": [ "EB Garamond" ], "body": [ "Manrope" ], "label": [ "Manrope" ] }, "fontSize": {} } } }</script></head><body class="bg-surface font-body text-on-surface antialiased"><aside class="fixed left-0 top-0 h-screen w-72 bg-surface-container-low shadow-[0_2px_16px_rgba(58,48,42,0.04)] z-50 flex flex-col justify-between py-6 px-5 border-r border-outline-variant/30"><div class="flex flex-col"><div class="px-3 pb-6 flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm"><span class="material-symbols-outlined text-2xl">local_fire_department</span></div><div class="flex flex-col"><span class="font-headline text-2xl font-bold tracking-tight text-on-surface leading-none">StudyTantra</span><span class="text-[11px] font-label font-medium tracking-wide uppercase text-on-surface-variant mt-1">AI Spaced Recall</span></div></div><nav class="flex flex-col gap-1 mt-1" data-active-classes="bg-primary text-on-primary font-semibold shadow-sm"><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="dashboard" href="#">Dashboard</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="document-library" href="#">Document Library</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="flashcards-vault" href="#">Flashcards Vault</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="spaced-review" href="#">Spaced Review</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="exam-planner" href="#">Exam Planner</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="quiz-engine" href="#">Quiz Engine</a><a aria-current="page" class="flex items-center px-3.5 py-2.5 rounded-lg transition-colors bg-primary text-on-primary font-semibold shadow-sm" data-path="collection-workspace" href="#">Collection Workspace</a><a class="flex items-center px-3.5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" data-path="settings-preferences" href="#">Settings &amp; Preferences</a></nav></div><div class="flex flex-col gap-4 px-1"><div class="p-4 rounded-xl bg-surface-container flex items-center justify-between shadow-[0_2px_16px_rgba(58,48,42,0.04)]"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[20px]">flare</span></div><div class="flex flex-col"><span class="text-[11px] font-label font-medium uppercase text-on-surface-variant">Mindful Habit</span><span class="text-xs font-semibold text-on-surface">14 Days Streak</span></div></div><span class="text-xs font-bold text-primary font-label bg-surface px-2 py-1 rounded-md">Lv. 4</span></div><div class="flex items-center justify-between pt-2 border-t border-outline-variant/40"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div><div class="flex flex-col"><span class="text-xs font-semibold text-on-surface leading-snug">Arya Sharma</span><span class="text-[10px] text-on-surface-variant">Scholar Plan</span></div></div><button aria-label="Account switcher" class="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">unfold_more</span></button></div></div></aside><div class="pl-72"><header class="fixed top-0 left-72 right-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(58,48,42,0.04)]"><div class="h-16 w-full px-8 flex items-center justify-between gap-6"><div class="flex-1 max-w-xl"><div class="relative flex items-center"><span class="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">search</span><input class="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="Search concepts, textbooks, notes, formulas..." type="text"/></div></div><div class="flex items-center gap-3.5"><div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface"><span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span><span class="font-label font-medium text-[11px] text-on-surface-variant">Active Deck:</span><span class="font-semibold text-primary text-[11px]">Cognitive Neuroscience</span></div><button aria-label="Notifications" class="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary"></span></button><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="relative pt-16 bg-surface min-h-screen"><div class="flex flex-col w-full">
<!-- Subtle Ambient Glow -->
<div class="relative w-full px-8 py-8 overflow-hidden">
<div class="absolute -top-32 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
<div class="absolute top-1/2 -left-20 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
<!-- Editorial Breadcrumb & Meta Bar -->
<div class="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6">
<div class="flex items-center gap-2 text-xs font-label tracking-wide uppercase text-on-surface-variant">
<a class="hover:text-primary transition-colors" href="#">Collections</a>
<span class="text-outline/60 text-xs">/</span>
<a class="hover:text-primary transition-colors" href="#">Spring 2025</a>
<span class="text-outline/60 text-xs">/</span>
<span class="font-semibold text-primary">CS-402: Database Management Systems</span>
</div>
<div class="flex items-center gap-3">
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-xs font-medium text-on-surface">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
          4.0 Credits
        </span>
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-xs font-medium text-on-surface-variant">
<span class="material-symbols-outlined text-[15px]">school</span>
          Prof. H. Stone
        </span>
<span class="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label text-[11px] font-bold uppercase tracking-wider">
          Cohort Rank: Top 8%
        </span>
</div>
</div>
<!-- Collection Banner / High Impact Hero Card -->
<section class="relative z-10 mb-8 rounded-2xl bg-surface-container-low shadow-[0_2px_24px_rgba(58,48,42,0.05)] overflow-hidden">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 md:p-10 items-center">
<!-- Text & Readiness Metrics -->
<div class="lg:col-span-8 flex flex-col justify-between">
<div class="flex items-center gap-3 mb-3">
<span class="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-label font-bold tracking-wider uppercase">
              Core Requirement
            </span>
<div class="flex items-center gap-1.5 text-xs text-on-surface-variant">
<span class="material-symbols-outlined text-primary text-[17px]">timer</span>
<span class="font-semibold text-on-surface">Final Exam in 9 Days</span>
<span class="text-outline">•</span>
<span>May 24, 09:00 AM</span>
<span class="text-outline">•</span>
<span class="font-bold text-primary">Target: A (4.0)</span>
</div>
</div>
<h1 class="font-headline text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-on-surface leading-tight mb-4">
            CS-402: Advanced Database Systems &amp; Transaction Processing
          </h1>
<p class="font-body text-sm text-on-surface-variant max-w-2xl leading-relaxed mb-6">
            Deep dive into ACID guarantees, serializability graphs, high-throughput lock protocols, buffer pool frame eviction, and the ARIES recovery paradigm.
          </p>
<!-- Readiness Progress Bar -->
<div class="bg-surface-container rounded-xl p-4 shadow-sm max-w-xl">
<div class="flex items-center justify-between mb-2">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[19px]">verified</span>
<span class="text-xs font-label uppercase font-semibold text-on-surface">Overall Syllabus Readiness</span>
</div>
<span class="font-headline text-lg font-bold text-primary">72%</span>
</div>
<div class="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
<div class="h-full rounded-full bg-primary transition-all duration-700 ease-out" style="width: 72%;"></div>
</div>
<div class="flex items-center justify-between text-[11px] text-on-surface-variant mt-2 font-label">
<span>142 Cards Retained</span>
<span>18 Due Today</span>
<span>38 Unexplored</span>
</div>
</div>
</div>
<!-- Banner Right Image & Actions -->
<div class="lg:col-span-4 flex flex-col items-start lg:items-end justify-between h-full gap-6">
<div class="relative w-full h-36 rounded-xl overflow-hidden shadow-sm">
<img class="w-full h-full object-cover" data-alt="A warm minimal study desk photograph with an open vintage database textbook, a brass desk lamp casting golden ambient light, clean notebook with fountain pen sketches of tree data structures, and warm terracotta tea mug in soft morning light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3uU1bucnzkd-Ed1YaazUnbhcYmEauGXlgNU0CWD77guTb34niSIohXXjbgGXJZrgwzJUfV9GtXVPQO_LrQASlm7Ww83gTgLLOvGvZUs8OsxQdLNNmZctVRJYJCOa4Is_-NnhmfZkDAhMc1-892EgpjPEMgoXmUERufe8B1gUaC5KNCAjaJcAx0cEo8JG2Bhqxdp48U28tcE-1-orz9nieutZp5Hdoh-oXW27oMXnS"/>
<div class="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
<div class="absolute bottom-3 left-3 text-[11px] font-label font-medium bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded text-on-surface">
              Storage Engine Arch • Unit IV
            </div>
</div>
<div class="flex flex-wrap lg:flex-nowrap gap-2.5 w-full">
<button class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-on-primary font-medium text-xs shadow-sm hover:opacity-95 transition-all">
<span class="material-symbols-outlined text-[17px]">play_circle</span>
<span>Launch Review (18)</span>
</button>
<button class="inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-medium text-xs transition-colors">
<span class="material-symbols-outlined text-[17px]">assignment_turned_in</span>
<span>Mock Exam</span>
</button>
<button aria-label="Add Source" class="p-3 rounded-lg bg-surface-container-high text-on-surface hover:text-primary transition-colors">
<span class="material-symbols-outlined text-[18px]">add</span>
</button>
</div>
</div>
</div>
</section>
<!-- 3-Column Tabbed Workspace Layout -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
<!-- ================= COLUMN 1: SYLLABUS & MODULE TREE (28%) ================= -->
<div class="lg:col-span-3 flex flex-col gap-4">
<div class="flex items-center justify-between px-2">
<div class="flex items-center gap-2">
<span class="font-headline text-xl font-bold text-on-surface">Syllabus Matrix</span>
<span class="px-2 py-0.5 rounded-full bg-surface-container-highest text-[10px] font-bold text-on-surface-variant font-label">5 Modules</span>
</div>
<button class="text-[11px] text-primary font-semibold hover:underline flex items-center gap-0.5">
<span>Filter</span>
<span class="material-symbols-outlined text-[14px]">tune</span>
</button>
</div>
<!-- Module 1: Mastered -->
<div class="group relative rounded-xl bg-surface-container p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
<div class="flex items-start justify-between gap-2">
<div class="flex items-center gap-2.5">
<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span class="text-xs font-label uppercase tracking-wider font-semibold text-on-surface-variant">Module 01</span>
</div>
<span class="px-2 py-0.5 rounded-md bg-surface text-primary font-label text-[10px] font-bold">100% Mastered</span>
</div>
<h2 class="font-headline text-base font-semibold text-on-surface mt-2 leading-snug">Relational Algebra &amp; SQL Formalisms</h2>
<p class="text-[11px] text-on-surface-variant mt-1 leading-normal line-clamp-2">Relational calculus, domain integrity, project-select operations, and query optimization plan equivalence.</p>
<div class="mt-3 pt-3 flex items-center justify-between text-[11px] text-secondary font-label">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[15px]">style</span>
              34 Cards
            </span>
<span class="text-primary font-medium flex items-center gap-0.5">
              Refreshed 2d ago
            </span>
</div>
</div>
<!-- Module 2: High Mastery -->
<div class="group relative rounded-xl bg-surface-container p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
<div class="flex items-start justify-between gap-2">
<div class="flex items-center gap-2.5">
<span class="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
<span class="text-xs font-label uppercase tracking-wider font-semibold text-on-surface-variant">Module 02</span>
</div>
<span class="px-2 py-0.5 rounded-md bg-surface text-on-surface font-label text-[10px] font-bold">88% Mastered</span>
</div>
<h2 class="font-headline text-base font-semibold text-on-surface mt-2 leading-snug">B+ Trees &amp; Extendible Storage Layout</h2>
<p class="text-[11px] text-on-surface-variant mt-1 leading-normal line-clamp-2">Node splits, bucket doubling, directory pointers, buffer management &amp; slotted-page storage architecture.</p>
<div class="mt-3 pt-3 flex items-center justify-between text-[11px] text-secondary font-label">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[15px]">style</span>
              42 Cards
            </span>
<span class="text-primary font-medium">4 Due Today</span>
</div>
</div>
<!-- Module 3: Active Focus -->
<div class="group relative rounded-xl bg-surface-container-high p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ring-1 ring-primary/20">
<div class="flex items-start justify-between gap-2">
<div class="flex items-center gap-2.5">
<span class="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
<span class="text-xs font-label uppercase tracking-wider font-semibold text-primary">Module 03 • In Progress</span>
</div>
<span class="px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed font-label text-[10px] font-bold">74% Mastered</span>
</div>
<h2 class="font-headline text-base font-semibold text-on-surface mt-2 leading-snug">Concurrency Control, 2PL &amp; Deadlocks</h2>
<p class="text-[11px] text-on-surface-variant mt-1 leading-normal line-clamp-2">Conflict serializability, precedence graphs, wait-for cycles, strict vs rigorous two-phase locking protocols.</p>
<div class="mt-3 pt-3 flex items-center justify-between text-[11px] text-secondary font-label">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[15px]">style</span>
              38 Cards
            </span>
<span class="font-semibold text-primary">8 Due Today</span>
</div>
</div>
<!-- Module 4: Urgent Review -->
<div class="group relative rounded-xl bg-tertiary-fixed/40 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
<div class="flex items-start justify-between gap-2">
<div class="flex items-center gap-2.5">
<span class="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
<span class="text-xs font-label uppercase tracking-wider font-semibold text-tertiary">Module 04 • Alert</span>
</div>
<span class="px-2 py-0.5 rounded-md bg-surface text-tertiary font-label text-[10px] font-bold">48% Recall</span>
</div>
<h2 class="font-headline text-base font-semibold text-on-surface mt-2 leading-snug">OCC &amp; Multi-Version Concurrency (MVCC)</h2>
<p class="text-[11px] text-on-surface-variant mt-1 leading-normal line-clamp-2">Validation phase hazards, Kung-Robinson theorem validation, and cascade rollback prevention under snapshot isolation.</p>
<div class="mt-3 pt-3 flex items-center justify-between text-[11px] font-label text-tertiary font-medium">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[15px]">priority_high</span>
              6 Cards Overdue
            </span>
<span>Needs Drill</span>
</div>
</div>
<!-- Module 5: Upcoming -->
<div class="group relative rounded-xl bg-surface-container-low p-4 shadow-sm opacity-90 transition-all cursor-pointer">
<div class="flex items-start justify-between gap-2">
<div class="flex items-center gap-2.5">
<span class="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
<span class="text-xs font-label uppercase tracking-wider font-semibold text-on-surface-variant">Module 05</span>
</div>
<span class="px-2 py-0.5 rounded-md bg-surface text-on-surface-variant font-label text-[10px] font-medium">Scheduled</span>
</div>
<h2 class="font-headline text-base font-semibold text-on-surface mt-2 leading-snug">ARIES Crash Recovery &amp; WAL Protocols</h2>
<p class="text-[11px] text-on-surface-variant mt-1 leading-normal line-clamp-2">Compensation log records (CLRs), physiological logging, dirty page tables, and analysis-redo-undo phases.</p>
<div class="mt-3 pt-3 flex items-center justify-between text-[11px] text-secondary font-label">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[15px]">event</span>
              Unlocks May 18
            </span>
<span class="text-on-surface-variant">22 Seed Cards</span>
</div>
</div>
</div>
<!-- ================= COLUMN 2: SYNTHESIS & STUDY MATERIALS (44%) ================= -->
<div class="lg:col-span-5 flex flex-col gap-6">
<!-- Linked Documents Scroller -->
<div class="flex flex-col gap-3">
<div class="flex items-center justify-between px-1">
<span class="text-xs font-label uppercase font-bold tracking-wider text-on-surface">Primary Course Sources</span>
<button class="text-xs font-medium text-primary hover:underline">Manage All (7)</button>
</div>
<div class="grid grid-cols-3 gap-3">
<div class="rounded-xl bg-surface-container-lowest p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between">
<div>
<div class="w-7 h-7 rounded-lg bg-primary-fixed flex items-center justify-center text-primary mb-2">
<span class="material-symbols-outlined text-[17px]">menu_book</span>
</div>
<h3 class="text-xs font-bold text-on-surface truncate">Silberschatz Ch. 19</h3>
<p class="text-[10px] text-on-surface-variant mt-0.5">Transactions &amp; Recovery</p>
</div>
<div class="mt-3 flex items-center gap-1 text-[10px] text-secondary font-label">
<span class="material-symbols-outlined text-[12px] text-primary">auto_awesome</span>
<span>AI Indexed</span>
</div>
</div>
<div class="rounded-xl bg-surface-container-lowest p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between">
<div>
<div class="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface mb-2">
<span class="material-symbols-outlined text-[17px]">slideshow</span>
</div>
<h3 class="text-xs font-bold text-on-surface truncate">Lectures 8–11 Deck</h3>
<p class="text-[10px] text-on-surface-variant mt-0.5">2PL &amp; Deadlock Graphs</p>
</div>
<div class="mt-3 flex items-center gap-1 text-[10px] text-secondary font-label">
<span class="material-symbols-outlined text-[12px]">check_circle</span>
<span>94 Flashcards</span>
</div>
</div>
<div class="rounded-xl bg-surface-container-lowest p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between">
<div>
<div class="w-7 h-7 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary mb-2">
<span class="material-symbols-outlined text-[17px]">quiz</span>
</div>
<h3 class="text-xs font-bold text-on-surface truncate">Midterm Solutions</h3>
<p class="text-[10px] text-on-surface-variant mt-0.5">Spring 2024 Past Paper</p>
</div>
<div class="mt-3 flex items-center gap-1 text-[10px] text-secondary font-label">
<span class="material-symbols-outlined text-[12px] text-tertiary">flag</span>
<span>3 Tricky Pitfalls</span>
</div>
</div>
</div>
</div>
<!-- AI Synthesized Study Guide -->
<article class="rounded-2xl bg-surface-container-lowest p-6 shadow-sm flex flex-col gap-5">
<div class="flex items-start justify-between">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[18px]">psychology</span>
</div>
<div>
<span class="text-[11px] font-label font-bold uppercase tracking-wider text-primary">Tantra Synthesis Engine</span>
<h3 class="font-headline text-xl font-bold text-on-surface leading-tight">High-Yield Synthesis: Concurrency Protocol Bounds</h3>
</div>
</div>
<button class="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors" title="Export markdown">
<span class="material-symbols-outlined text-[18px]">ios_share</span>
</button>
</div>
<!-- Section 1: Kung-Robinson OCC Conditions -->
<div class="p-4 rounded-xl bg-surface-container-low text-xs leading-relaxed">
<div class="flex items-center gap-2 mb-1.5 text-on-surface font-semibold">
<span class="material-symbols-outlined text-primary text-[16px]">rule</span>
<span>Kung-Robinson Optimistic Validation Conditions</span>
</div>
<p class="text-on-surface-variant mb-2">
              For any two transactions <span class="font-mono text-primary font-bold">T<sub>i</sub> &lt; T<sub>j</sub></span> in serial order, validation holds without cascade rollbacks if at least one of these holds:
            </p>
<div class="space-y-1.5 pl-2 font-mono text-[11px] text-on-surface">
<div class="flex items-start gap-2">
<span class="text-primary font-bold">1.</span>
<span>T<sub>i</sub> completes all phases (Read, Validate, Write) before T<sub>j</sub> begins Read.</span>
</div>
<div class="flex items-start gap-2">
<span class="text-primary font-bold">2.</span>
<span>WS(T<sub>i</sub>) ∩ RS(T<sub>j</sub>) = ∅ AND T<sub>i</sub> completes Write before T<sub>j</sub> starts Write.</span>
</div>
<div class="flex items-start gap-2">
<span class="text-primary font-bold">3.</span>
<span>WS(T<sub>i</sub>) ∩ RS(T<sub>j</sub>) = ∅ AND WS(T<sub>i</sub>) ∩ WS(T<sub>j</sub>) = ∅ simultaneously.</span>
</div>
</div>
</div>
<!-- Section 2: Strict 2PL vs Rigorous 2PL Proof Card -->
<div class="flex flex-col gap-2">
<span class="text-xs font-label uppercase tracking-wide font-bold text-on-surface-variant">Protocol Comparison: Strict vs. Rigorous 2PL</span>
<div class="grid grid-cols-2 gap-3 text-xs">
<div class="p-3.5 rounded-xl bg-surface-container flex flex-col justify-between">
<div>
<span class="text-[11px] font-bold text-on-surface font-label uppercase">Strict 2PL (S2PL)</span>
<p class="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                    All exclusive (X) locks must be retained until transaction commits or aborts. Shared (S) locks can be released dynamically in the shrinking phase.
                  </p>
</div>
<div class="mt-3 text-[10px] text-primary font-semibold font-label">Prevents Cascading Aborts (ACA)</div>
</div>
<div class="p-3.5 rounded-xl bg-surface-container flex flex-col justify-between">
<div>
<span class="text-[11px] font-bold text-on-surface font-label uppercase">Rigorous 2PL (R2PL)</span>
<p class="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                    Both exclusive (X) and shared (S) locks are held until transaction commit/abort. Complete isolation of write and read sets throughout life cycle.
                  </p>
</div>
<div class="mt-3 text-[10px] text-primary font-semibold font-label">Guarantees Strict Serializability</div>
</div>
</div>
</div>
<!-- Section 3: Diagrammatic Illustration -->
<div class="p-4 rounded-xl bg-surface-container-high/60 flex flex-col gap-3">
<div class="flex items-center justify-between">
<span class="text-xs font-semibold text-on-surface">Lock Table Hash-Map Bucket Architecture</span>
<span class="text-[10px] font-mono text-outline">O(1) Avg Lookup</span>
</div>
<!-- Inline Mini Diagram -->
<div class="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
<div class="p-2 rounded bg-surface text-on-surface font-semibold shadow-xs">Hash(DataID)</div>
<div class="p-2 rounded bg-primary-fixed text-on-primary-fixed font-bold">→ Lock Head</div>
<div class="p-2 rounded bg-surface text-on-surface font-semibold shadow-xs">Granted List [X, S]</div>
<div class="p-2 rounded bg-surface-container-highest text-secondary">Wait Queue [FIFO]</div>
</div>
</div>
</article>
<!-- Formula Reference Sheet Widget -->
<div class="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
<div class="flex items-center justify-between mb-4">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[19px]">functions</span>
<h3 class="font-headline text-lg font-bold text-on-surface">Key Formula Reference Sheet</h3>
</div>
<span class="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">Exam Ready</span>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
<div class="p-3.5 rounded-xl bg-surface-container-low flex flex-col justify-between">
<span class="text-[10px] font-label uppercase tracking-wider text-secondary font-semibold">B+ Tree Max Fanout Bound</span>
<div class="py-2 text-center">
<span class="font-headline text-lg font-bold text-on-surface italic">p ≤ ⌊ (B - p_r) / (k + p_b) ⌋</span>
</div>
<p class="text-[10px] text-on-surface-variant leading-tight">Where B = Block size, k = Key size, p_b = Child pointer size.</p>
</div>
<div class="p-3.5 rounded-xl bg-surface-container-low flex flex-col justify-between">
<span class="text-[10px] font-label uppercase tracking-wider text-secondary font-semibold">Extendible Hash Directory Size</span>
<div class="py-2 text-center">
<span class="font-headline text-lg font-bold text-on-surface italic">Directory Entries = 2<sup>d</sup></span>
</div>
<p class="text-[10px] text-on-surface-variant leading-tight">Where d = global depth, splits occur when local depth d' = d.</p>
</div>
</div>
</div>
</div>
<!-- ================= COLUMN 3: DIAGNOSTIC ANALYTICS & SOCRATIC COPILOT (28%) ================= -->
<div class="lg:col-span-4 flex flex-col gap-6">
<!-- Weakest Concept Radar -->
<div class="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
<div class="flex items-center justify-between mb-3">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-tertiary text-[18px]">warning</span>
<h3 class="font-headline text-lg font-bold text-on-surface">Vulnerability Radar</h3>
</div>
<span class="text-[10px] font-label font-bold text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded">High Risk</span>
</div>
<p class="text-xs text-on-surface-variant mb-4">Concepts with spaced repetition recall dipping below 60%.</p>
<div class="space-y-3">
<div class="p-3 rounded-xl bg-surface-container-low flex flex-col gap-2">
<div class="flex items-center justify-between">
<span class="text-xs font-semibold text-on-surface">Cascading Aborts in BOCC</span>
<span class="text-xs font-bold text-tertiary">48% Recall</span>
</div>
<div class="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
<div class="h-full bg-tertiary rounded-full" style="width: 48%;"></div>
</div>
<div class="flex items-center justify-between text-[10px] text-on-surface-variant font-label">
<span>Mistaken on 3 consecutive drills</span>
<a class="text-primary font-bold hover:underline" href="#">Drill Concept</a>
</div>
</div>
<div class="p-3 rounded-xl bg-surface-container-low flex flex-col gap-2">
<div class="flex items-center justify-between">
<span class="text-xs font-semibold text-on-surface">Wait-Die vs. Wound-Wait</span>
<span class="text-xs font-bold text-primary-container">52% Recall</span>
</div>
<div class="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
<div class="h-full bg-primary-container rounded-full" style="width: 52%;"></div>
</div>
<div class="flex items-center justify-between text-[10px] text-on-surface-variant font-label">
<span>Preemption priority inverted</span>
<a class="text-primary font-bold hover:underline" href="#">Review Flashcard</a>
</div>
</div>
</div>
</div>
<!-- Retention Stability Distribution -->
<div class="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
<div class="flex items-center justify-between mb-2">
<h3 class="font-headline text-lg font-bold text-on-surface">Retention Curve</h3>
<span class="text-xs font-mono text-primary font-bold">FSRS-4.5</span>
</div>
<p class="text-xs text-on-surface-variant mb-4">Projected memory stability over the next 14 days without review.</p>
<!-- Inline SVG Retention Chart -->
<div class="w-full h-28">
<svg class="w-full h-full overflow-visible text-primary" viewbox="0 0 280 80">
<defs>
<lineargradient id="curveGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="currentColor" stop-opacity="0.25"></stop>
<stop offset="100%" stop-color="currentColor" stop-opacity="0.0"></stop>
</lineargradient>
</defs>
<!-- Grid marks -->
<line stroke="currentColor" stroke-dasharray="3,3" stroke-opacity="0.08" x1="0" x2="280" y1="20" y2="20"></line>
<line stroke="currentColor" stroke-dasharray="3,3" stroke-opacity="0.08" x1="0" x2="280" y1="50" y2="50"></line>
<!-- Filled area -->
<path d="M 0 10 Q 50 15, 100 28 T 200 48 T 280 62 L 280 80 L 0 80 Z" fill="url(#curveGradient)"></path>
<!-- Smooth curve line -->
<path d="M 0 10 Q 50 15, 100 28 T 200 48 T 280 62" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.5"></path>
<!-- Today marker -->
<circle class="fill-primary stroke-surface" cx="100" cy="28" r="4.5" stroke-width="2"></circle>
<text class="text-[9px] font-label font-bold" fill="#3a302a" x="106" y="24">Today (Day 5)</text>
<!-- Exam date marker -->
<line stroke="#8c3c3c" stroke-dasharray="2,2" stroke-width="1.5" x1="230" x2="230" y1="5" y2="75"></line>
<text class="text-[9px] font-label font-bold uppercase" fill="#8c3c3c" x="233" y="14">Exam</text>
</svg>
</div>
<div class="mt-4 pt-3 flex items-center justify-between text-xs">
<div class="flex flex-col">
<span class="text-[10px] font-label text-on-surface-variant uppercase">Today's Target</span>
<span class="font-bold text-on-surface text-sm">1h 20m</span>
</div>
<div class="flex flex-col text-right">
<span class="text-[10px] font-label text-on-surface-variant uppercase">Memory Halflife</span>
<span class="font-bold text-primary text-sm">11.4 Days</span>
</div>
</div>
</div>
<!-- Socratic Copilot Prompt Widget -->
<div class="rounded-2xl bg-gradient-to-br from-surface-container to-surface-container-high p-5 shadow-sm">
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined text-primary text-[20px]">forum</span>
<h3 class="font-headline text-lg font-bold text-on-surface">Socratic Copilot</h3>
</div>
<p class="text-xs text-on-surface-variant mb-3">Ask questions to test your mental models against CS-402 lecture transcripts.</p>
<div class="relative flex flex-col gap-2">
<textarea class="w-full p-3 rounded-xl bg-surface text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-inner resize-none" id="copilot-input" placeholder="Ask Tantra AI a question about CS-402 (e.g. Why does Wait-Die allow starvation while Wound-Wait prevents it?)..." rows="3"></textarea>
<div class="flex items-center justify-between pt-1">
<div class="flex items-center gap-1.5 text-[10px] text-on-surface-variant font-label">
<span class="w-2 h-2 rounded-full bg-primary"></span>
<span>Context: Ch 18-19 + Slides</span>
</div>
<button class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-medium text-xs hover:opacity-95 transition-opacity" onclick="handlePromptSubmit()">
<span>Inquire</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>
<!-- Suggested quick questions -->
<div class="mt-4 pt-3 space-y-1.5">
<span class="text-[10px] font-label uppercase font-bold text-secondary">Quick Questions</span>
<button class="w-full text-left p-2 rounded-lg bg-surface/70 hover:bg-surface text-[11px] text-on-surface transition-colors truncate" onclick="fillPrompt('Explain why 2PL guarantees conflict serializability but NOT view serializability.')">
              → Explain 2PL conflict vs view serializability proof
            </button>
<button class="w-full text-left p-2 rounded-lg bg-surface/70 hover:bg-surface text-[11px] text-on-surface transition-colors truncate" onclick="fillPrompt('Give a minimal 3-transaction schedule that causes a cascade abort under standard 2PL.')">
              → Minimal schedule causing cascade aborts in 2PL
            </button>
</div>
</div>
</div>
</div>
</div>
</div>
<script>
  function fillPrompt(text) {
    const el = document.getElementById('copilot-input');
    if (el) {
      el.value = text;
      el.focus();
    }
  }

  function handlePromptSubmit() {
    const el = document.getElementById('copilot-input');
    if (el && el.value.trim().length > 0) {
      const originalValue = el.value;
      el.value = "Analyzing corpus for: " + originalValue.substring(0, 36) + "...";
      setTimeout(() => {
        el.value = "";
        el.placeholder = "Response ready! Check synthesis thread or ask another question...";
      }, 1200);
    }
  }
</script></main></div></body></html>

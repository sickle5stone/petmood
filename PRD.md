Alright, building hat on. Video over snap is the right call, and it's also the only thing separating you from the static-frame bots that already exist — a single frame can't tell a slow blink from a wince or a stretch from a pounce, and it has no audio. 3-5 seconds gives you temporal signal (tail flick, ear swivel, slow-blink, gait) plus a vocalization track. Build around that; it's the edge.
The architectural move is to split cheap on-device temporal extraction from expensive semantic synthesis — don't throw 150 frames at a VLM:
#mermaid-rl7-r2 { font-family: "Anthropic Sans", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; fill: rgb(25, 25, 25); }
#mermaid-rl7-r2 .edge-animation-slow { stroke-dashoffset: 900; animation: 50s linear 0s infinite normal none running dash; stroke-linecap: round; stroke-dasharray: 9, 5 !important; }
#mermaid-rl7-r2 .edge-animation-fast { stroke-dashoffset: 900; animation: 20s linear 0s infinite normal none running dash; stroke-linecap: round; stroke-dasharray: 9, 5 !important; }
#mermaid-rl7-r2 .error-icon { fill: rgb(204, 120, 92); }
#mermaid-rl7-r2 .error-text { fill: rgb(51, 135, 163); stroke: rgb(51, 135, 163); }
#mermaid-rl7-r2 .edge-thickness-normal { stroke-width: 1px; }
#mermaid-rl7-r2 .edge-thickness-thick { stroke-width: 3.5px; }
#mermaid-rl7-r2 .edge-pattern-solid { stroke-dasharray: 0; }
#mermaid-rl7-r2 .edge-thickness-invisible { stroke-width: 0; fill: none; }
#mermaid-rl7-r2 .edge-pattern-dashed { stroke-dasharray: 3; }
#mermaid-rl7-r2 .edge-pattern-dotted { stroke-dasharray: 2; }
#mermaid-rl7-r2 .marker { fill: rgb(145, 145, 141); stroke: rgb(145, 145, 141); }
#mermaid-rl7-r2 .marker.cross { stroke: rgb(145, 145, 141); }
#mermaid-rl7-r2 svg { font-family: "Anthropic Sans", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; }
#mermaid-rl7-r2 p { margin: 0px; }
#mermaid-rl7-r2 .label { font-family: "Anthropic Sans", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: rgb(25, 25, 25); }
#mermaid-rl7-r2 .cluster-label text { fill: rgb(51, 135, 163); }
#mermaid-rl7-r2 .cluster-label span { color: rgb(51, 135, 163); }
#mermaid-rl7-r2 .cluster-label span p { background-color: transparent; }
#mermaid-rl7-r2 .label text, #mermaid-rl7-r2 span { fill: rgb(25, 25, 25); color: rgb(25, 25, 25); }
#mermaid-rl7-r2 .node rect, #mermaid-rl7-r2 .node circle, #mermaid-rl7-r2 .node ellipse, #mermaid-rl7-r2 .node polygon, #mermaid-rl7-r2 .node path { fill: rgb(240, 240, 235); stroke: rgb(217, 216, 213); stroke-width: 1px; }
#mermaid-rl7-r2 .rough-node .label text, #mermaid-rl7-r2 .node .label text, #mermaid-rl7-r2 .image-shape .label, #mermaid-rl7-r2 .icon-shape .label { text-anchor: middle; }
#mermaid-rl7-r2 .node .katex path { fill: rgb(0, 0, 0); stroke: rgb(0, 0, 0); stroke-width: 1px; }
#mermaid-rl7-r2 .rough-node .label, #mermaid-rl7-r2 .node .label, #mermaid-rl7-r2 .image-shape .label, #mermaid-rl7-r2 .icon-shape .label { text-align: center; }
#mermaid-rl7-r2 .node.clickable { cursor: pointer; }
#mermaid-rl7-r2 .root .anchor path { stroke-width: 0; stroke: rgb(145, 145, 141); fill: rgb(145, 145, 141) !important; }
#mermaid-rl7-r2 .arrowheadPath { fill: rgb(11, 11, 11); }
#mermaid-rl7-r2 .edgePath .path { stroke: rgb(145, 145, 141); stroke-width: 1px; }
#mermaid-rl7-r2 .flowchart-link { stroke: rgb(145, 145, 141); fill: none; }
#mermaid-rl7-r2 .edgeLabel { background-color: rgb(245, 230, 216); text-align: center; }
#mermaid-rl7-r2 .edgeLabel p { background-color: rgb(245, 230, 216); }
#mermaid-rl7-r2 .edgeLabel rect { opacity: 0.5; background-color: rgb(245, 230, 216); fill: rgb(245, 230, 216); }
#mermaid-rl7-r2 .labelBkg { background-color: rgba(245, 230, 216, 0.5); }
#mermaid-rl7-r2 .cluster rect { fill: rgb(204, 120, 92); stroke: rgb(138, 115, 107); stroke-width: 1px; }
#mermaid-rl7-r2 .cluster text { fill: rgb(51, 135, 163); }
#mermaid-rl7-r2 .cluster span { color: rgb(51, 135, 163); }
#mermaid-rl7-r2 div.mermaidTooltip { position: absolute; text-align: center; max-width: 200px; padding: 2px; font-family: "Anthropic Sans", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 12px; background: rgb(204, 120, 92); border: 1px solid rgb(138, 115, 107); border-radius: 2px; pointer-events: none; z-index: 100; }
#mermaid-rl7-r2 .flowchartTitleText { text-anchor: middle; font-size: 18px; fill: rgb(25, 25, 25); }
#mermaid-rl7-r2 rect.text { fill: none; stroke-width: 0; }
#mermaid-rl7-r2 .icon-shape, #mermaid-rl7-r2 .image-shape { background-color: rgb(245, 230, 216); text-align: center; }
#mermaid-rl7-r2 .icon-shape p, #mermaid-rl7-r2 .image-shape p { background-color: rgb(245, 230, 216); padding: 2px; }
#mermaid-rl7-r2 .icon-shape .label rect, #mermaid-rl7-r2 .image-shape .label rect { opacity: 0.5; background-color: rgb(245, 230, 216); fill: rgb(245, 230, 216); }
#mermaid-rl7-r2 .label-icon { display: inline-block; height: 1em; overflow: visible; vertical-align: -0.125em; }
#mermaid-rl7-r2 .node .label-icon path { fill: currentcolor; stroke: revert; stroke-width: revert; }
#mermaid-rl7-r2 .node .neo-node { stroke: rgb(217, 216, 213); }
#mermaid-rl7-r2 [data-look="neo"].node rect, #mermaid-rl7-r2 [data-look="neo"].cluster rect, #mermaid-rl7-r2 [data-look="neo"].node polygon { stroke: url("#mermaid-rl7-r2-gradient"); filter: drop-shadow(rgb(185, 185, 185) 1px 2px 2px); }
#mermaid-rl7-r2 [data-look="neo"].node path { stroke: url("#mermaid-rl7-r2-gradient"); stroke-width: 1px; }
#mermaid-rl7-r2 [data-look="neo"].node .outer-path { filter: drop-shadow(rgb(185, 185, 185) 1px 2px 2px); }
#mermaid-rl7-r2 [data-look="neo"].node .neo-line path { stroke: rgb(217, 216, 213); filter: none; }
#mermaid-rl7-r2 [data-look="neo"].node circle { stroke: url("#mermaid-rl7-r2-gradient"); filter: drop-shadow(rgb(185, 185, 185) 1px 2px 2px); }
#mermaid-rl7-r2 [data-look="neo"].node circle .state-start { fill: rgb(0, 0, 0); }
#mermaid-rl7-r2 [data-look="neo"].icon-shape .icon { fill: url("#mermaid-rl7-r2-gradient"); filter: drop-shadow(rgb(185, 185, 185) 1px 2px 2px); }
#mermaid-rl7-r2 [data-look="neo"].icon-shape .icon-neo path { stroke: url("#mermaid-rl7-r2-gradient"); filter: drop-shadow(rgb(185, 185, 185) 1px 2px 2px); }
#mermaid-rl7-r2 :root { --mermaid-font-family: "Anthropic Sans",system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }unusual for herCapture: 3-5s videoOn-device pre-processMotion-gated keyframesAudio → vocalization classMotion magnitude:still→agitatedVLM synthesiskeyframes + structuredfeaturesRead: activity confident ·affect calibrated · evidenceshownPer-cat baseline log
On-device, fast/free/private: motion-gated keyframe sampling (3-4 frames at pose changes, not uniform), an audio event classifier (start YAMNet-class — runs on-device, has animal-sound classes; swap in a cat-specific model trained on the vocalization corpus MeowTalk used later), and an optical-flow magnitude for still/mild/active/agitated. Vocalization is your most grounded signal — purr/trill/chirp/growl/hiss carry real valence, unlike posture-from-a-frame.
Then feed the keyframes plus those features as structured context to the VLM, and prompt for three things separately: activity (open-vocab, high confidence), affect (calibrated, explicit uncertainty), and the evidence used. That separation is the whole game. The thing that kills these apps is confident wrong emotion — MeowTalk reading "I love you" off a cat screaming at an empty bowl. Your structural fix: be confident about what's observable ("loafed, still, soft purr at 0:02") and treat feeling as a hypothesis with shown evidence ("likely relaxed — slow blink, loaf posture, purr"). Showing the evidence is both more trustworthy and more delightful than a bare verdict. Lead with doing, hedge feeling — which also maps onto where the science sits, so you're not lying to users.
The moat, logged from day one: per-cat baseline. Every read writes to a store keyed on the cat. v0 doesn't surface it, but a few weeks of a cat's normal turns the valuable sentence into "this is unusual for her" — deviation from her own baseline, not a generic label. That's the only durable differentiator here, and it's where any real health/early-warning wedge grows from. (It's also the part that's structurally Kiyo, which is the one reason this isn't a total tangent — but architect the logging now, build the baseline UI when you have data.)
The unglamorous risk that decides retention: cat detection and framing in the wild. Half-under the couch, bad light, two cats in frame, cat that won't hold still for 3 seconds. "Is there a cat, which one, is it readable" is where trust is won or lost — not in the affect model. Budget real effort there.
Stack: iOS native first (Core ML gives you the audio/motion/pose on-device cleanly; paying cat owners skew iOS). Frontier VLM behind a Worker proxy — same Worker+Stripe shape you already run for ChocolateBar. Animal-pose keypoints (ear angle, eye openness → grimace-scale features) is a later upgrade, not v0.
v0 cut, tests the one real question: record 3-5s, on-device audio+motion, 3-4 keyframes → VLM with that context → "Doing: X. Likely feeling: Y, because Z." Log everything, skip pose, skip per-cat training, skip baseline UI. The question it answers in a weekend: do temporal+audio reads feel meaningfully better than a static-frame bot? Yes → the baseline layer is the business. No → you found out cheap.
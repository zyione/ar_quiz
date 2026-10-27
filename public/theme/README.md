# Hogwarts at night UI assets

`common-room.webp` is the locally bundled common-room illustration used by the welcome page and the quieter backgrounds elsewhere. `academy.svg` is the house-neutral castle insignia. The visual theme is defined in `src/theme.css`; quiz state, gesture calculations, questions, and scoring rules are unchanged.

The artwork was generated using the built-in imagegen tool, then encoded as WebP for delivery. Original generation prompt:

> Create a single landscape 1536x1024 cinematic illustrated environment background asset for a Hogwarts-inspired quiz website, no UI no words no letters no logos no crests no snake. House neutral ancient magical boarding school common room at night. Rich painterly realistic digital matte painting, aged emerald-black wood panels, soaring gothic arched windows, antique library shelves, carved stone fireplace on the RIGHT with small warm amber fire, leather armchair, candles floating subtly above, celestial brass astrolabe on an old desk. Moody dark forest-green shadows and muted antique gold highlights, exquisite old world craftsmanship. Wide interior perspective; left third intentionally darker and quiet for text overlay, detailed fireplace and tall arched window on right half, subtly visible moonlit castle towers through glass. Elegant mysterious studious atmosphere, warm amber candlelight against very deep green black. No people no modern objects. Full bleed artwork, no borders. This is an actual background image asset, not a website screenshot.

Fonts are bundled in `public/fonts` for local use: Cinzel for display lettering, Cormorant Garamond for the welcome introduction, and Inter for controls and quiz content. Their SIL Open Font License notices are included alongside the font files. Sources: the respective `ofl/cinzel`, `ofl/cormorantgaramond`, and `ofl/inter` directories in the Google Fonts repository.

All illustrations and fonts load from this app. The artwork never replaces the webcam feed. Decorative elements do not intercept pointer input. Reduced-motion preferences disable CSS animations and celebration particles.

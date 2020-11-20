export const hrRules = [
  new RegExp(
    '^(.+(s|š)k)(ijima|ijega|ijemu|ijem|ijim|ijih|ijoj|ijeg|iji|ije|ija|oga|ome|omu|ima|og|om|im|ih|oj|i|e|o|a|u)$'
  ),
  new RegExp('^(.+(s|š)tv)(ima|om|o|a|u)$'),
  new RegExp('^(.+(t|m|p|r|g)anij)(ama|ima|om|a|u|e|i|)$'),
  new RegExp('^(.+an)(inom|ina|inu|ine|ima|in|om|u|i|a|e|)$'),
  new RegExp('^(.+in)(ima|ama|om|a|e|i|u|o|)$'),
  new RegExp('^(.+on)(ovima|ova|ove|ovi|ima|om|a|e|i|u|)$'),
  new RegExp(
    '^(.+n)(ijima|ijega|ijemu|ijeg|ijem|ijim|ijih|ijoj|iji|ije|ija|iju|ima|ome|omu|oga|oj|om|ih|im|og|o|e|a|u|i|)$'
  ),
  new RegExp(
    '^(.+(a|e|u)ć)(oga|ome|omu|ega|emu|ima|oj|ih|om|eg|em|og|uh|im|e|a)$'
  ),
  new RegExp('^(.+ugov)(ima|i|e|a)$'),
  new RegExp('^(.+ug)(ama|om|a|e|i|u|o)$'),
  new RegExp('^(.+log)(ama|om|a|u|e|)$'),
  new RegExp('^(.+[^eo]g)(ovima|ama|ovi|ove|ova|om|a|e|i|u|o|)$'),
  new RegExp('^(.+(rrar|ott|ss|ll)i)(jem|ja|ju|o|)$'),
  new RegExp('^(.+uj)(ući|emo|ete|mo|em|eš|e|u|)$'),
  new RegExp('^(.+(c|č|ć|đ|l|r)aj)(evima|evi|eva|eve|ama|ima|em|a|e|i|u|)$'),
  new RegExp('^(.+(b|c|d|l|n|m|ž|g|f|p|r|s|t|z)ij)(ima|ama|om|a|e|i|u|o|)$'),
  new RegExp('^(.+[^z]nal)(ima|ama|om|a|e|i|u|o|)$'),
  new RegExp('^(.+ijal)(ima|ama|om|a|e|i|u|o|)$'),
  new RegExp('^(.+ozil)(ima|om|a|e|u|i|)$'),
  new RegExp('^(.+olov)(ima|i|a|e)$'),
  new RegExp('^(.+ol)(ima|om|a|u|e|i|)$'),
  new RegExp('^(.+lem)(ama|ima|om|a|e|i|u|o|)$'),
  new RegExp('^(.+ram)(ama|om|a|e|i|u|o)$'),
  new RegExp('^(.+(a|d|e|o)r)(ama|ima|om|u|a|e|i|)$'),
  new RegExp('^(.+(e|i)s)(ima|om|e|a|u)$'),
  new RegExp('^(.+(t|n|j|k|j|t|b|g|v)aš)(ama|ima|om|em|a|u|i|e|)$'),
  new RegExp('^(.+(e|i)š)(ima|ama|om|em|i|e|a|u|)$'),
  new RegExp('^(.+ikat)(ima|om|a|e|i|u|o|)$'),
  new RegExp('^(.+lat)(ima|om|a|e|i|u|o|)$'),
  new RegExp('^(.+et)(ama|ima|om|a|e|i|u|o|)$'),
  new RegExp('^(.+(e|i|k|o)st)(ima|ama|om|a|e|i|u|o|)$'),
  new RegExp('^(.+išt)(ima|em|a|e|u)$'),
  new RegExp('^(.+ova)(smo|ste|hu|ti|še|li|la|le|lo|t|h|o)$'),
  new RegExp(
    '^(.+(a|e|i)v)(ijemu|ijima|ijega|ijeg|ijem|ijim|ijih|ijoj|oga|ome|omu|ima|ama|iji|ije|ija|iju|im|ih|oj|om|og|i|a|u|e|o|)$'
  ),
  new RegExp(
    '^(.+[^dkml]ov)(ijemu|ijima|ijega|ijeg|ijem|ijim|ijih|ijoj|oga|ome|omu|ima|iji|ije|ija|iju|im|ih|oj|om|og|i|a|u|e|o|)$'
  ),
  new RegExp('^(.+(m|l)ov)(ima|om|a|u|e|i|)$'),
  new RegExp(
    '^(.+el)(ijemu|ijima|ijega|ijeg|ijem|ijim|ijih|ijoj|oga|ome|omu|ima|iji|ije|ija|iju|im|ih|oj|om|og|i|a|u|e|o|)$'
  ),
  new RegExp(
    '^(.+(a|e|š)nj)(ijemu|ijima|ijega|ijeg|ijem|ijim|ijih|ijoj|oga|ome|omu|ima|iji|ije|ija|iju|ega|emu|eg|em|im|ih|oj|om|og|a|e|i|o|u)$'
  ),
  new RegExp('^(.+čin)(ama|ome|omu|oga|ima|og|om|im|ih|oj|a|u|i|o|e|)$'),
  new RegExp('^(.+roši)(vši|smo|ste|še|mo|te|ti|li|la|lo|le|m|š|t|h|o)$'),
  new RegExp(
    '^(.+oš)(ijemu|ijima|ijega|ijeg|ijem|ijim|ijih|ijoj|oga|ome|omu|ima|iji|ije|ija|iju|im|ih|oj|om|og|i|a|u|e|)$'
  ),
  new RegExp(
    '^(.+(e|o)vit)(ijima|ijega|ijemu|ijem|ijim|ijih|ijoj|ijeg|iji|ije|ija|oga|ome|omu|ima|og|om|im|ih|oj|i|e|o|a|u|)$'
  ),
  new RegExp(
    '^(.+ast)(ijima|ijega|ijemu|ijem|ijim|ijih|ijoj|ijeg|iji|ije|ija|oga|ome|omu|ima|og|om|im|ih|oj|i|e|o|a|u|)$'
  ),
  new RegExp(
    '^(.+k)(ijemu|ijima|ijega|ijeg|ijem|ijim|ijih|ijoj|oga|ome|omu|ima|iji|ije|ija|iju|im|ih|oj|om|og|i|a|u|e|o|)$'
  ),
  new RegExp(
    '^(.+(e|a|i|u)va)(jući|smo|ste|jmo|jte|ju|la|le|li|lo|mo|na|ne|ni|no|te|ti|še|hu|h|j|m|n|o|t|v|š|)$'
  ),
  new RegExp(
    '^(.+ir)(ujemo|ujete|ujući|ajući|ivat|ujem|uješ|ujmo|ujte|avši|asmo|aste|ati|amo|ate|aju|aše|ahu|ala|alo|ali|ale|uje|uju|uj|al|an|am|aš|at|ah|ao)$'
  ),
  new RegExp(
    '^(.+ač)(ismo|iste|iti|imo|ite|iše|eći|ila|ilo|ili|ile|ena|eno|eni|ene|io|im|iš|it|ih|en|i|e)$'
  ),
  new RegExp(
    '^(.+ača)(vši|smo|ste|smo|ste|hu|ti|mo|te|še|la|lo|li|le|ju|na|no|ni|ne|o|m|š|t|h|n)$'
  ),
  new RegExp(
    '^(.+n)(uvši|usmo|uste|ući|imo|ite|emo|ete|ula|ulo|ule|uli|uto|uti|uta|em|eš|uo|ut|e|u|i)$'
  ),
  new RegExp('^(.+ni)(vši|smo|ste|ti|mo|te|mo|te|la|lo|le|li|m|š|o)$'),
  new RegExp(
    '^(.+((a|r|i|p|e|u)st|[^o]g|ik|uc|oj|aj|lj|ak|ck|čk|šk|uk|nj|im|ar|at|et|št|it|ot|ut|zn|zv)a)(jući|vši|smo|ste|jmo|jte|jem|mo|te|je|ju|ti|še|hu|la|li|le|lo|na|no|ni|ne|t|h|o|j|n|m|š)$'
  ),
  new RegExp(
    '^(.+ur)(ajući|asmo|aste|ajmo|ajte|amo|ate|aju|ati|aše|ahu|ala|ali|ale|alo|ana|ano|ani|ane|al|at|ah|ao|aj|an|am|aš)$'
  ),
  new RegExp(
    '^(.+(a|i|o)staj)(asmo|aste|ahu|ati|emo|ete|aše|ali|ući|ala|alo|ale|mo|ao|em|eš|at|ah|te|e|u|)$'
  ),
  new RegExp(
    '^(.+(b|c|č|ć|d|e|f|g|j|k|n|r|t|u|v)a)(lama|lima|lom|lu|li|la|le|lo|l)$'
  ),
  new RegExp('^(.+(t|č|j|ž|š)aj)(evima|evi|eva|eve|ama|ima|em|a|e|i|u|)$'),
  new RegExp(
    '^(.+([^o]m|ič|nč|uč|b|c|ć|d|đ|h|j|k|l|n|p|r|s|š|v|z|ž)a)(jući|vši|smo|ste|jmo|jte|mo|te|ju|ti|še|hu|la|li|le|lo|na|no|ni|ne|t|h|o|j|n|m|š)$'
  ),
  new RegExp(
    '^(.+(a|i|o)sta)(dosmo|doste|doše|nemo|demo|nete|dete|nimo|nite|nila|vši|nem|dem|neš|deš|doh|de|ti|ne|nu|du|la|li|lo|le|t|o)$'
  ),
  new RegExp(
    '^(.+ta)(smo|ste|jmo|jte|vši|ti|mo|te|ju|še|la|lo|le|li|na|no|ni|ne|n|j|o|m|š|t|h)$'
  ),
  new RegExp(
    '^(.+inj)(asmo|aste|ati|emo|ete|ali|ala|alo|ale|aše|ahu|em|eš|at|ah|ao)$'
  ),
  new RegExp(
    '^(.+as)(temo|tete|timo|tite|tući|tem|teš|tao|te|li|ti|la|lo|le)$'
  ),
  new RegExp(
    '^(.+(elj|ulj|tit|ac|ič|od|oj|et|av|ov)i)(vši|eći|smo|ste|še|mo|te|ti|li|la|lo|le|m|š|t|h|o)$'
  ),
  new RegExp(
    '^(.+(tit|jeb|ar|ed|uš|ič)i)(jemo|jete|jem|ješ|smo|ste|jmo|jte|vši|mo|še|te|ti|ju|je|la|lo|li|le|t|m|š|h|j|o)$'
  ),
  new RegExp(
    '^(.+(b|č|d|l|m|p|r|s|š|ž)i)(jemo|jete|jem|ješ|smo|ste|jmo|jte|vši|mo|lu|še|te|ti|ju|je|la|lo|li|le|t|m|š|h|j|o)$'
  ),
  new RegExp(
    '^(.+luč)(ujete|ujući|ujemo|ujem|uješ|ismo|iste|ujmo|ujte|uje|uju|iše|iti|imo|ite|ila|ilo|ili|ile|ena|eno|eni|ene|uj|io|en|im|iš|it|ih|e|i)$'
  ),
  new RegExp('^(.+jeti)(smo|ste|še|mo|te|ti|li|la|lo|le|m|š|t|h|o)$'),
  new RegExp('^(.+e)(lama|lima|lom|lu|li|la|le|lo|l)$'),
  new RegExp('^(.+i)(lama|lima|lom|lu|li|la|le|lo|l)$'),
  new RegExp(
    '^(.+at)(ijega|ijemu|ijima|ijeg|ijem|ijih|ijim|ima|oga|ome|omu|iji|ije|ija|iju|oj|og|om|im|ih|a|u|i|e|o|)$'
  ),
  new RegExp('^(.+et)(avši|ući|emo|imo|em|eš|e|u|i)$'),
  new RegExp(
    '^(.+)(ajući|alima|alom|avši|asmo|aste|ajmo|ajte|ivši|amo|ate|aju|ati|aše|ahu|ali|ala|ale|alo|ana|ano|ani|ane|am|aš|at|ah|ao|aj|an)$'
  ),
  new RegExp(
    '^(.+)(anje|enje|anja|enja|enom|enoj|enog|enim|enih|anom|anoj|anog|anim|anih|eno|ovi|ova|oga|ima|ove|enu|anu|ena|ama)$'
  ),
  new RegExp(
    '^(.+)(nijega|nijemu|nijima|nijeg|nijem|nijim|nijih|nima|niji|nije|nija|niju|noj|nom|nog|nim|nih|an|na|nu|ni|ne|no)$'
  ),
  new RegExp('^(.+)(om|og|im|ih|em|oj|an|u|o|i|e|a)$'),
]

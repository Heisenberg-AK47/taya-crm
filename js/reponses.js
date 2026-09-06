// ============================================================
// REPONSES AUX QUESTIONNAIRES
// Vue transversale du CRM : toutes les reponses de tous les
// questionnaires au meme endroit, avec l'etat de la sequence de
// relance et de quoi recontacter la personne en un clic.
//
// Le CRM tient dans un seul fichier ; ce module recoit ses outils
// (React, Supabase, palette) au lieu de les redeclarer.
// ============================================================

/* Une reponse peut etre un texte, un oui/non, une liste de choix ou un
   bloc de champs (Nom / Prenom / Email...). On rend chaque cas lisible. */
export function valeurLisible(v) {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'boolean') return v ? 'Oui' : 'Non';
  if (Array.isArray(v)) return v.length ? v.join(', ') : null;
  if (typeof v === 'object') {
    const l = Object.entries(v)
      .filter(([, x]) => x !== null && x !== undefined && String(x).trim() !== '')
      .map(([k, x]) => k + ' : ' + x);
    return l.length ? l.join('\n') : null;
  }
  return String(v);
}

/* Le numero de telephone se cache dans le bloc d'informations, sous un
   libelle qui varie (Telephone, Portable, Mobile...). */
export function telephoneDe(answers) {
  for (const v of Object.values(answers || {})) {
    if (!v || typeof v !== 'object' || Array.isArray(v)) continue;
    for (const [k, x] of Object.entries(v)) {
      if (/t[eé]l|portable|mobile/i.test(k) && String(x || '').trim()) return String(x).trim();
    }
  }
  return '';
}

export function creerReponses(o) {
  const { h, useState, useEffect, useMemo, sb, C, card, btn, inp, badge } = o;

  /* Ou en est cette personne dans la sequence de 5 relances. */
  function etatRelance(r) {
    if (r.converted_at) return { label: 'A souscrit', couleur: C.green };
    if (r.unsubscribed) return { label: 'Desinscrite', couleur: C.muted };
    const envoyees = ['relance_j1_sent_at', 'relance_j2_sent_at', 'relance_j3_sent_at',
                      'relance_j4_sent_at', 'relance_j5_sent_at'].filter((k) => r[k]).length;
    if (envoyees === 0) return { label: 'Relances a venir', couleur: C.blue };
    if (envoyees >= 5) return { label: 'Sequence terminee', couleur: C.purple };
    return { label: 'Relance ' + envoyees + '/5', couleur: C.gold };
  }

  return function Reponses() {
    const [reponses, setReponses] = useState([]);
    const [forms, setForms] = useState([]);
    const [questions, setQuestions] = useState({});
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState('');
    const [ouverte, setOuverte] = useState(null);
    const [filtreForm, setFiltreForm] = useState('tous');
    const [recherche, setRecherche] = useState('');

    useEffect(() => {
      async function charger() {
        const [rep, frm, qst] = await Promise.all([
          sb.from('form_responses').select('*').order('created_at', { ascending: false }).limit(500),
          sb.from('forms').select('id,title,slug'),
          sb.from('form_questions').select('id,form_id,title,type,order_index').order('order_index'),
        ]);
        if (rep.error) setErreur(rep.error.message);
        setReponses(rep.data || []);
        setForms(frm.data || []);
        // Les libelles des questions, ranges par questionnaire.
        const parForm = {};
        (qst.data || []).forEach((x) => { (parForm[x.form_id] = parForm[x.form_id] || []).push(x); });
        setQuestions(parForm);
        setLoading(false);
      }
      charger();
    }, []);

    const titreForm = (id) => (forms.find((f) => f.id === id) || {}).title || 'Questionnaire';

    const filtrees = useMemo(() => {
      const t = recherche.trim().toLowerCase();
      return reponses.filter((r) => {
        if (filtreForm !== 'tous' && r.form_id !== filtreForm) return false;
        if (!t) return true;
        return ((r.respondent_name || '') + ' ' + (r.respondent_email || '')).toLowerCase().includes(t);
      });
    }, [reponses, filtreForm, recherche]);

    const stats = useMemo(() => {
      const semaine = Date.now() - 7 * 86400000;
      return {
        total: reponses.length,
        semaine: reponses.filter((r) => new Date(r.created_at).getTime() >= semaine).length,
        enCours: reponses.filter((r) => !r.converted_at && !r.unsubscribed).length,
        converties: reponses.filter((r) => r.converted_at).length,
      };
    }, [reponses]);

    const tuile = (valeur, libelle, couleur) =>
      h('div', { style: { ...card, padding: '18px 20px' } },
        h('div', { style: { fontSize: 26, fontWeight: 800, color: couleur } }, valeur),
        h('div', { style: { fontSize: 12, color: C.muted, marginTop: 2 } }, libelle));

    function exporterCsv() {
      const lignes = [['Questionnaire', 'Nom', 'Email', 'Recu le', 'Etat']];
      filtrees.forEach((r) => lignes.push([
        titreForm(r.form_id), r.respondent_name || '', r.respondent_email || '',
        new Date(r.created_at).toLocaleString('fr-FR'), etatRelance(r).label,
      ]));
      const csv = lignes.map((l) => l.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(';')).join('\n');
      // Le BOM evite qu'Excel massacre les accents a l'ouverture.
      const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reponses-questionnaires.csv';
      a.click();
      URL.revokeObjectURL(url);
    }

    const boutonPlat = {
      background: 'transparent', border: '1px solid ' + C.border, color: C.muted,
      borderRadius: 10, padding: '10px 18px', fontSize: 13, cursor: 'pointer',
    };

    return h('div', null,
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24, flexWrap: 'wrap' } },
        h('div', null,
          h('h1', { style: { fontSize: 24, fontWeight: 700, color: C.white, marginBottom: 4 } }, 'Reponses aux questionnaires'),
          h('p', { style: { color: C.muted, fontSize: 13 } }, 'Tout ce que tes prospects ont repondu, tous questionnaires confondus')),
        h('button', { onClick: exporterCsv, style: boutonPlat }, 'Exporter en CSV')),

      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginBottom: 20 } },
        tuile(stats.total, 'Reponses au total', C.white),
        tuile(stats.semaine, 'Ces 7 derniers jours', C.blue),
        tuile(stats.enCours, 'Relances en cours', C.gold),
        tuile(stats.converties, 'Ont souscrit', C.green)),

      h('div', { style: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' } },
        h('input', { style: { ...inp, flex: '1 1 240px' }, placeholder: 'Rechercher un nom ou un email...', value: recherche, onChange: (e) => setRecherche(e.target.value) }),
        h('select', { style: { ...inp, flex: '0 1 260px' }, value: filtreForm, onChange: (e) => setFiltreForm(e.target.value) },
          h('option', { value: 'tous' }, 'Tous les questionnaires'),
          ...forms.map((f) => h('option', { key: f.id, value: f.id }, f.title)))),

      erreur && h('div', { style: { ...card, marginBottom: 16, color: C.red, fontSize: 13 } }, 'Lecture impossible : ' + erreur),

      loading ? h('p', { style: { color: C.muted } }, 'Chargement...') :
      filtrees.length === 0 ? h('div', { style: { ...card, textAlign: 'center', padding: '50px 20px', color: C.muted } },
        reponses.length === 0
          ? "Aucune reponse pour le moment. Des qu'une personne termine un questionnaire, elle apparait ici."
          : 'Aucune reponse ne correspond a cette recherche.') :
      h('div', { style: { display: 'grid', gap: 10 } },
        ...filtrees.map((r) => {
          const etat = etatRelance(r);
          const ouvert = ouverte === r.id;
          const qs = (questions[r.form_id] || []).filter((q) => q.type !== 'info_screen');
          const tel = telephoneDe(r.answers);
          const vides = qs.every((q) => valeurLisible(r.answers && r.answers[q.id]) === null);

          return h('div', { key: r.id, style: { ...card, padding: 0, overflow: 'hidden', border: '1px solid ' + (ouvert ? C.gold : C.border) } },
            h('div', { onClick: () => setOuverte(ouvert ? null : r.id), style: { padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' } },
              h('div', { style: { flex: '1 1 220px', minWidth: 0 } },
                h('div', { style: { fontSize: 15, fontWeight: 600, color: C.white } }, r.respondent_name || r.respondent_email || 'Sans nom'),
                h('div', { style: { fontSize: 12, color: C.muted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis' } }, r.respondent_email || 'email non renseigne')),
              h('span', { style: { ...badge(C.blue), whiteSpace: 'nowrap' } }, titreForm(r.form_id)),
              h('span', { style: { ...badge(etat.couleur), whiteSpace: 'nowrap' } }, etat.label),
              h('div', { style: { fontSize: 12, color: C.muted, whiteSpace: 'nowrap' } }, new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })),
              h('span', { style: { color: C.muted, fontSize: 12 } }, ouvert ? 'Fermer' : 'Voir')),

            ouvert && h('div', { style: { padding: '0 20px 20px', borderTop: '1px solid ' + C.border } },
              h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0 18px' } },
                r.respondent_email && h('a', { href: 'mailto:' + r.respondent_email, style: { ...btn, padding: '9px 16px', fontSize: 13, textDecoration: 'none' } }, 'Repondre par email'),
                tel && h('a', { href: 'https://wa.me/' + tel.replace(/\D/g, '').replace(/^0/, '33'), target: '_blank', rel: 'noopener', style: { background: 'transparent', border: '1px solid ' + C.border, color: C.white, borderRadius: 10, padding: '9px 16px', fontSize: 13, textDecoration: 'none' } }, 'WhatsApp ' + tel),
                h('span', { style: { fontSize: 12, color: C.muted, alignSelf: 'center' } }, 'Recu le ' + new Date(r.created_at).toLocaleString('fr-FR'))),

              ...qs.map((q) => {
                const txt = valeurLisible(r.answers && r.answers[q.id]);
                if (txt === null) return null;
                return h('div', { key: q.id, style: { marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid ' + C.border } },
                  h('div', { style: { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.gold, marginBottom: 5 } }, q.title),
                  h('div', { style: { fontSize: 14, color: C.white, lineHeight: 1.7, whiteSpace: 'pre-line' } }, txt));
              }).filter(Boolean),

              vides && h('p', { style: { color: C.muted, fontSize: 13 } }, 'Aucune reponse enregistree pour ce questionnaire.')));
        })));
  };
}

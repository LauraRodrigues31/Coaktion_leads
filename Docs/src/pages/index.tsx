import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home(): ReactNode {
  return (
    <Layout
      title="Proposta"
      description="Proposta técnica de captação de leads offline para os totens da Coaktion no Conarec 2026.">
      <main className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Proposta técnica · Coaktion · Conarec 2026</p>
          <h1 className={styles.title}>
            Captação de leads <span className={styles.highlight}>offline</span> no totem.
          </h1>
          <p className={styles.subtitle}>
            Uma proposta para tirar os totens da dependência de Wi-Fi dedicado no
            estande: o mesmo formulário React da landing page passa a rodar direto
            no navegador do totem, guardando cada lead no próprio tablet e
            sincronizando com o Supabase só no fim do evento.
          </p>
          <Link className={styles.cta} to="/visao-geral">
            Ver a proposta completa →
          </Link>
        </div>
      </main>
    </Layout>
  );
}

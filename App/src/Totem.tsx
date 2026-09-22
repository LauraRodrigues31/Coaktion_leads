import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { PROPOSTA, STAFF_BUTTON_STYLE } from "@/lib/layout";
import { saveLeadLocal } from "@/lib/db";
import { getTotemId, type TotemId } from "@/lib/totemId";
import { setupPwa } from "@/pwa";
import { StaffPanel, TotemSetup } from "@/StaffPanel";
import {
  CARGO_OPTIONS,
  FLOW,
  QUESTIONS,
  shouldSkip,
  type Question,
  type Step,
} from "@/lib/experience/questions";
import { buildReading } from "@/lib/experience/scoring";

// Arquivos locais (public/assets), empacotados no cache offline.
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const politicaPrivacidade = { url: asset("politica-de-privacidade-coaktion.pdf") };
const endorsedLogo = { url: asset("akite-kompelys-endorsed.webp") };
const foodImage = { url: asset("mimos-gastronomicos.png") };

interface ContactData {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  cargo: string;
}

const EMPTY_CONTACT: ContactData = { nome: "", empresa: "", email: "", telefone: "", cargo: "" };

const ACKS = ["Boa.", "Anotado.", "Vamos para a próxima.", "Estamos chegando lá.", "Mais uma.", "É isso."];

export function Totem() {
  const [totemId, setTotemId] = useState<TotemId | null>(() => getTotemId());
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState<ContactData>(EMPTY_CONTACT);
  const [consent, setConsent] = useState(false);
  
  const [draft, setDraft] = useState("");
  const [ack, setAck] = useState<string | null>(null);
  const [ticket, setTicket] = useState<{ code: string; nome: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const submittedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const step = FLOW[stepIndex] as Step;

  useEffect(() => {
    setupPwa();
  }, []);

  const reset = useCallback(() => {

    setStepIndex(0);
    setAnswers({});
    setContact(EMPTY_CONTACT);
    setConsent(false);
    
    setDraft("");
    setAck(null);
    setTicket(null);
    setSaving(false);
    setSaveError(null);
    submittedRef.current = false;
  }, []);

  const advance = useCallback(
    (nextAnswers?: Record<string, string>) => {
      const effective = nextAnswers ?? answers;
      setStepIndex((current) => {
        let next = current + 1;
        while (next < FLOW.length && shouldSkip(FLOW[next] as Step, effective)) next += 1;
        return Math.min(next, FLOW.length - 1);
      });
      setDraft("");
    },
    [answers],
  );

  const goBack = useCallback(() => {
    setSaveError(null);
    setStepIndex((current) => {
      let prev = current - 1;
      while (prev > 0 && shouldSkip(FLOW[prev] as Step, answers)) prev -= 1;
      return Math.max(prev, 0);
    });
    setDraft("");
  }, [answers]);

  // Ao entrar numa etapa de digitação, pré-carrega o valor já informado.
  useEffect(() => {
    if (step.kind === "text") {
      setDraft(contact[step.field] ?? "");
      const timer = setTimeout(() => inputRef.current?.focus(), 220);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [step, contact]);

  const reading = useMemo(() => buildReading(answers, contact.cargo), [answers, contact.cargo]);

  const submitExperience = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSaving(true);
    setSaveError(null);

    const payload = {
          nome: contact.nome,
          empresa: contact.empresa,
          cargo: CARGO_OPTIONS.find((c) => c.value === contact.cargo)?.label ?? null,
          email: contact.email,
          telefone: contact.telefone,
          consent,
          mimos: [] as string[],

          score_aktie: reading.score_aktie,
          score_kompelys: reading.score_kompelys,
          empresa_principal: reading.empresa_principal,
          empresa_secundaria: reading.empresa_secundaria,
          dor_principal: reading.dor_principal,
          dor_secundaria: reading.dor_secundaria,
          perguntas_aktie_respondidas: reading.perguntas_aktie_respondidas,
          perguntas_kompelys_respondidas: reading.perguntas_kompelys_respondidas,
          qualificacao: reading.qualificacao,
          perfil_slug: reading.perfil.slug,
          perfil_titulo: reading.perfil.titulo,
          respostas: reading.respostas,
    };
    try {
      const result = await saveLeadLocal(payload, totemId ?? "totem-0");
      setSaving(false);
      setTicket({ code: result.ticket_code, nome: contact.nome });
    } catch (err) {
      console.error(err);
      setSaving(false);
      submittedRef.current = false;
      setSaveError("Não conseguimos gerar seu voucher agora. Tente novamente.");
      return;
    }
    advance();
  }, [advance, contact, consent, reading, totemId]);

  const contentPadding = !PROPOSTA || step.kind === "welcome"
    ? "pt-[2vh] lg:pt-[3vh]"
    : step.kind === "ticket"
      ? "pt-[25dvh]" // 480 px de 1920
      : "pt-[53.85dvh]"; // 1034 px de 1920

  if (!totemId) return <TotemSetup onChoose={setTotemId} />;

  return (
    <main className="totem-background relative flex h-[100dvh] flex-col overflow-hidden bg-background px-6 pt-5 lg:px-14 lg:pt-6">
      {!PROPOSTA && (
        <TopBar
          onBack={stepIndex > 0 && step.kind !== "ticket" && !saving ? goBack : undefined}
        />
      )}
      {PROPOSTA && step.kind === "welcome" && <TopBar />}
      {PROPOSTA && stepIndex > 0 && step.kind !== "ticket" && !saving && (
        <button
          onClick={goBack}
          aria-label="Voltar uma etapa"
          className="tap-card absolute left-14 top-[83.33dvh] z-20 flex h-[72px] w-[72px] items-center justify-center text-[32px] text-muted-foreground"
        >
          ‹
        </button>
      )}


      <div className="flex min-h-0 flex-1 flex-col pb-40 lg:pb-44">
        <div className={`flex min-h-0 flex-1 items-start justify-center overflow-hidden ${contentPadding}`}>
          <div className="w-full max-w-4xl px-2 pb-4">
            {step.kind === "welcome" && <Welcome onStart={() => advance()} />}

            {step.kind === "intro" && <IntroScreen nome={contact.nome} onStart={() => advance()} />}

            {step.kind === "question" && (
              <QuestionScreen
                key={step.questionId}
                question={QUESTIONS[step.questionId] as Question}
                selected={answers[step.questionId]}
                onSelect={(value, acknowledgement) => {
                  const next = { ...answers, [step.questionId]: value };
                  setAnswers(next);
                  setAck(acknowledgement);
                  setTimeout(() => {
                    setAck(null);
                    advance(next);
                  }, 380);
                }}
              />
            )}

            {step.kind === "text" && (
              <TextScreen
                title={step.title}
                placeholder={step.placeholder}
                inputType={step.inputType}
                value={draft}
                inputRef={inputRef}
                onChange={setDraft}
                onSubmit={() => {
                  const value = draft.trim();
                  if (!isValid(step.field, value)) return;
                  setContact((c) => ({ ...c, [step.field]: value }));
                  advance();
                }}
                valid={isValid(step.field, draft.trim())}
              />
            )}

            {step.kind === "cargo" && (
              <CargoScreen
                selected={contact.cargo}
                onSelect={(value) => {
                  setContact((c) => ({ ...c, cargo: value }));
                  setAck("Boa.");
                  setTimeout(() => {
                    setAck(null);
                    advance();
                  }, 320);
                }}
              />
            )}

            {step.kind === "contato" && (
              <ContatoScreen
                email={contact.email}
                telefone={contact.telefone}
                onChange={(patch) => setContact((c) => ({ ...c, ...patch }))}
                onSubmit={() => advance()}
              />
            )}

            {step.kind === "consent" && (
              <ConsentScreen
                checked={consent}
                onToggle={() => setConsent((v) => !v)}
                saving={saving}
                error={saveError}
                onContinue={() => void submitExperience()}
              />
            )}

            {step.kind === "ticket" && ticket && (
              <TicketScreen onFinish={reset} />
            )}

          </div>
        </div>

      </div>

      <img
        src={endorsedLogo.url}
        alt="Aktie Now e Kompelys — parte da Coaktion Ecosystem"
        className={`absolute left-1/2 h-auto max-h-24 w-[70%] max-w-[25rem] -translate-x-1/2 object-contain lg:max-h-28 lg:max-w-[30rem] ${
          PROPOSTA && step.kind !== "welcome" ? "top-[7.3dvh]" : "bottom-10 lg:bottom-12"
        }`}
      />

      {ack && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 flex justify-center">
          <span className="animate-in fade-in slide-in-from-bottom-2 rounded-full bg-primary px-5 py-2 text-base font-bold text-primary-foreground">
            {ack}
          </span>
        </div>
      )}

      <StaffReset onReset={reset} />
      <StaffPanel totemId={totemId} onTotemChange={setTotemId} />
    </main>
  );
}

function isValid(field: string, value: string) {
  if (field === "nome") return value.length >= 2;
  if (field === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  if (field === "telefone") return value.replace(/\D/g, "").length >= 10;
  return value.length >= 2;
}

function TopBar({ onBack }: { onBack?: (() => void) | undefined }) {
  return (
    <header className="flex h-11 shrink-0 items-center">
      {onBack ? (
        <button
          onClick={onBack}
          className="tap-card flex h-11 w-11 items-center justify-center text-xl text-muted-foreground"
          aria-label="Voltar uma etapa"
        >
          ‹
        </button>
      ) : (
        <span className="h-11 w-11" />
      )}
    </header>
  );
}


function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="flex w-full flex-col items-center justify-start text-center"
      onClick={onStart}
      role="button"
      aria-label="Toque na tela para começar"
    >
      <img
        src={foodImage.url}
        alt="Café, chá, doces e sanduíches"
        className="mb-6 h-auto max-h-[45vh] w-full max-w-[48rem] object-contain"
      />
      <h1 className="text-balance text-6xl font-bold leading-[1.05] lg:text-7xl">
        Faça seu pedido aqui
      </h1>
      <p className="mt-5 text-xl font-medium text-muted-foreground lg:mt-6 lg:text-2xl">
        toque na tela para começar
      </p>
    </div>
  );
}

function IntroScreen({ nome, onStart }: { nome: string; onStart: () => void }) {
  const primeiroNome = nome.trim().split(" ")[0] ?? "";
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div>
        <h2 className="mt-5 text-balance text-5xl leading-[1.08]">
          {primeiroNome ? `${primeiroNome},` : ""} está na hora de{" "}
          <span className="text-primary">saborear boas experiências</span>.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">
          Responda algumas perguntas rápidas sobre a sua operação e retire seus vouchers para ganhar mimos gastronômicos.
        </p>
        <button
          onClick={onStart}
          className="action-gradient mt-8 w-full rounded-full px-8 py-5 text-2xl font-bold text-primary-foreground active:scale-[0.98]"
        >
          Avançar
        </button>
      </div>
    </div>
  );
}



function QuestionScreen({
  question,
  selected,
  onSelect,
}: {
  question: Question;
  selected?: string | undefined;
  onSelect: (value: string, ack: string) => void;
}) {
  const [otherPlatform, setOtherPlatform] = useState(
    question.id === "Q01" && selected?.startsWith("outra:") ? selected.slice(6) : "",
  );
  const [showOther, setShowOther] = useState(question.id === "Q01" && selected?.startsWith("outra:"));

  return (
    <div className="text-center">
      <h2 className="mx-auto max-w-3xl text-balance text-3xl leading-tight lg:text-4xl">{question.text}</h2>
      <div
        className={`mt-8 grid gap-4 ${
          question.options.length >= 4 ? "grid-cols-2" : "grid-cols-1"
        }`}
      >

        {question.options.map((option, i) => (
          <button
            key={option.value}
            onClick={() => {
              if (question.id === "Q01" && option.value === "outra") {
                setShowOther(true);
                return;
              }
              onSelect(option.value, question.ack ?? (ACKS[i] as string));
            }}
            className={`tap-card flex min-h-[7rem] items-center justify-center px-6 py-5 text-center text-xl font-medium ${
              selected === option.value ? "border-primary bg-primary/15" : ""
            }`}
          >
            <span className="text-balance leading-snug">{option.label}</span>
          </button>
        ))}
      </div>
      {showOther && (
        <form
          className="mx-auto mt-4 flex max-w-2xl gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const platform = otherPlatform.trim();
            if (platform.length >= 2) onSelect(`outra:${platform}`, question.ack ?? "Anotado.");
          }}
        >
          <input
            autoFocus
            value={otherPlatform}
            onChange={(event) => setOtherPlatform(event.target.value)}
            placeholder="Digite o nome da plataforma"
            aria-label="Nome da outra plataforma"
            className="min-w-0 flex-1 rounded-2xl border border-input bg-white/5 px-5 py-3 text-lg outline-none placeholder:text-muted-foreground/60 focus:border-primary"
          />
          <button
            type="submit"
            disabled={otherPlatform.trim().length < 2}
            className="action-gradient rounded-full px-7 py-3 text-lg font-bold text-primary-foreground disabled:opacity-35"
          >
            Continuar
          </button>
        </form>
      )}
    </div>
  );
}

function TextScreen({
  title,
  placeholder,
  inputType,
  value,
  onChange,
  onSubmit,
  valid,
  inputRef,
}: {
  title: string;
  placeholder: string;
  inputType: "text" | "email" | "tel";
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  valid: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const autoComplete =
    inputType === "email" ? "email" : inputType === "tel" ? "tel" : placeholder.includes("empresa") ? "organization" : "name";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="mx-auto flex w-full max-w-2xl flex-col text-center"
    >
      <h2 className="text-balance text-3xl leading-tight lg:text-4xl">{title}</h2>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={inputType}
        inputMode={inputType === "tel" ? "tel" : inputType === "email" ? "email" : "text"}
        autoComplete={autoComplete}
        autoCapitalize={inputType === "text" ? "words" : "none"}
        autoCorrect="off"
        enterKeyHint="next"
        placeholder={placeholder}
        className="mt-6 w-full rounded-2xl border border-input bg-white/5 px-5 py-4 text-center text-2xl outline-none placeholder:text-muted-foreground/60 focus:border-primary"
      />
      <button
        type="submit"
        disabled={!valid}
        className="action-gradient mt-4 w-full rounded-full px-8 py-4 text-xl font-bold text-primary-foreground disabled:opacity-35"
      >
        Continuar
      </button>
    </form>
  );
}

function CargoScreen({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) {
  return (
    <div className="text-center">
      <h2 className="text-balance text-3xl leading-tight lg:text-4xl">Qual é o seu cargo?</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CARGO_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`tap-card min-h-[4.25rem] px-5 py-4 text-left text-lg font-medium ${
              selected === option.value ? "border-primary bg-primary/15" : ""
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ContatoScreen({
  email,
  telefone,
  onChange,
  onSubmit,
}: {
  email: string;
  telefone: string;
  onChange: (patch: Partial<ContactData>) => void;
  onSubmit: () => void;
}) {
  const emailOk = isValid("email", email.trim());
  const telOk = isValid("telefone", telefone.trim());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (emailOk && telOk) onSubmit();
      }}
      className="mx-auto flex w-full max-w-3xl flex-col text-center"
    >
      <h2 className="text-balance text-3xl leading-tight lg:text-4xl">Onde falamos com você?</h2>
      <p className="mt-2 text-base text-muted-foreground">
        E-mail corporativo e WhatsApp. Só isso e seu pedido vai para o balcão.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="text-left">
          <label className="block text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            E-mail corporativo
          </label>
          <input
            value={email}
            onChange={(e) => onChange({ email: e.target.value })}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            enterKeyHint="next"
            placeholder="voce@empresa.com"
            className="mt-2 w-full rounded-2xl border border-input bg-white/5 px-4 py-4 text-xl outline-none placeholder:text-muted-foreground/60 focus:border-primary"
          />
        </div>
        <div className="text-left">
          <label className="block text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            WhatsApp
          </label>
          <input
            value={telefone}
            onChange={(e) => onChange({ telefone: e.target.value })}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="done"
            placeholder="(11) 90000-0000"
            className="mt-2 w-full rounded-2xl border border-input bg-white/5 px-4 py-4 text-xl outline-none placeholder:text-muted-foreground/60 focus:border-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!emailOk || !telOk}
        className="action-gradient mt-5 w-full rounded-full px-8 py-4 text-xl font-bold text-primary-foreground disabled:opacity-35"
      >
        Continuar
      </button>
    </form>
  );
}


const POLICY_POINTS = [
  "Seus dados são tratados pela Coaktion e pelas empresas do seu ecossistema (Aktie Now, Callwe, Droz, Workise e Syntrika), conforme a LGPD.",
  "Usamos suas respostas e contato apenas para continuar a conversa sobre a sua operação e enviar conteúdos e comunicações.",
  "Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo e-mail dpo@coaktion.com.",
];

function ConsentScreen({
  checked,
  onToggle,
  saving,
  error,
  onContinue,
}: {
  checked: boolean;
  onToggle: () => void;
  saving: boolean;
  error: string | null;
  onContinue: () => void;
}) {
  const [showPolicy, setShowPolicy] = useState(false);

  return (
    <div className="mx-auto w-full max-w-2xl text-center">
      <h2 className="text-balance text-3xl leading-tight lg:text-4xl">Podemos continuar a conversa depois?</h2>
      <div
        className={`tap-card mt-5 flex w-full items-center gap-4 px-5 py-4 text-left text-lg ${
          checked ? "border-primary bg-primary/15" : ""
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-label={checked ? "Retirar consentimento" : "Concordar com o uso dos dados"}
          aria-pressed={checked}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
            checked ? "border-primary bg-primary text-primary-foreground" : "border-input"
          }`}
        >
          {checked ? "✓" : ""}
        </button>
        <p>
          Li e concordo em compartilhar meus dados com a Coaktion e em receber comunicações, de acordo com a{" "}
          <button
            type="button"
            onClick={() => setShowPolicy(true)}
            className="font-semibold text-primary underline underline-offset-4"
          >
            Política de Privacidade
          </button>
          .
        </p>
      </div>
      {error && <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>}
      <button
        onClick={onContinue}
        disabled={saving || !checked}
        className="action-gradient mt-5 w-full rounded-full px-8 py-4 text-xl font-bold text-primary-foreground disabled:opacity-35"
      >
        {saving ? "Gerando vouchers..." : "Ver meus vouchers"}
      </button>

      {showPolicy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setShowPolicy(false)}
        >
          <div
            className="flex max-h-[85dvh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-background p-6 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold">Política de Privacidade e Proteção de Dados</h3>
            <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-2 text-base leading-relaxed text-muted-foreground">
              {POLICY_POINTS.map((point) => (
                <p key={point} className="flex gap-3">
                  <span className="text-primary">•</span>
                  {point}
                </p>
              ))}
              <p className="flex gap-3">
                <span className="text-primary">•</span>
                <a
                  href={politicaPrivacidade.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  Ler o documento completo (PDF)
                </a>
              </p>
            </div>
            <button
              onClick={() => setShowPolicy(false)}
              className="mt-5 w-full rounded-full bg-primary px-8 py-3 text-lg font-bold text-primary-foreground"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TicketScreen({ onFinish }: { onFinish: () => void }) {

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
      <h2 className="text-balance text-4xl font-bold leading-[1.08] lg:text-5xl">
        Obrigado por fazer seu pedido
      </h2>
      <ol className="mt-6 w-full space-y-4 text-center text-lg leading-snug lg:mt-7 lg:text-xl">
        <li className="animate-fade-in flex flex-col items-center gap-2" style={{ animationDelay: "0.1s" }}>
          <strong className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-base text-primary-foreground">
            1
          </strong>
          <span>Retire seus vouchers com nosso time</span>
        </li>
        <li className="animate-fade-in flex flex-col items-center gap-2" style={{ animationDelay: "0.25s" }}>
          <strong className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-base text-accent-foreground">
            2
          </strong>
          <span>Escolha seus mimos nos carrinhos</span>
        </li>
        <li className="animate-fade-in flex flex-col items-center gap-2" style={{ animationDelay: "0.4s" }}>
          <strong className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-base text-primary-foreground">
            3
          </strong>
          <span>Conheça mais sobre a Aktie Now e a Kompelys</span>
        </li>
      </ol>
      <img
        src={foodImage.url}
        alt="Café, chá, doces e sanduíches"
        className="mt-5 h-auto max-h-[21vh] w-full max-w-[34rem] object-contain lg:mt-6"
      />
      <button
        onClick={onFinish}
        className="action-gradient mt-4 w-full rounded-full px-10 py-4 text-lg font-bold text-primary-foreground lg:mt-5"
      >
        Encerrar
      </button>
    </div>
  );
}





/** Reinício discreto para o atendente: pressione e segure o ponto por 1,5s. */
function StaffReset({ onReset }: { onReset: () => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [armed, setArmed] = useState(false);

  const start = () => {
    setArmed(true);
    timerRef.current = setTimeout(() => {
      setArmed(false);
      onReset();
    }, 1500);
  };
  const cancel = () => {
    setArmed(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <button
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onContextMenu={(e) => e.preventDefault()}
      style={STAFF_BUTTON_STYLE}
      aria-label="Reiniciar experiência (equipe)"
      className={`fixed bottom-3 right-3 h-10 w-10 rounded-full transition-colors ${
        armed ? "bg-accent/70" : "bg-white/10"
      }`}
    />
  );
}


-- Create table for articles
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for challenges
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge TEXT NOT NULL,
  is_fixed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user challenge progress
CREATE TABLE public.user_challenge_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  challenge_id UUID REFERENCES public.challenges NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Create table for quiz questions
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for collection points
CREATE TABLE public.collection_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  waste_types JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for daily phrases
CREATE TABLE public.daily_phrases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phrase TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_phrases ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to static content
CREATE POLICY "Anyone can read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Anyone can read challenges" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Anyone can read quiz questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can read collection points" ON public.collection_points FOR SELECT USING (true);
CREATE POLICY "Anyone can read daily phrases" ON public.daily_phrases FOR SELECT USING (true);

-- Create policies for user challenge progress (users can only see/modify their own progress)
CREATE POLICY "Users can view their own progress" ON public.user_challenge_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own progress" ON public.user_challenge_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_challenge_progress FOR UPDATE USING (auth.uid() = user_id);

-- Insert initial data
INSERT INTO public.articles (title, description, image) VALUES
('Como Reciclar Corretamente', 'Aprenda as melhores práticas para separar e descartar materiais recicláveis, contribuindo para um planeta mais limpo.', '/placeholder.svg'),
('Compostagem Doméstica', 'Descubra como transformar restos de comida em adubo natural para suas plantas, reduzindo o desperdício orgânico.', '/placeholder.svg'),
('Redução de Plástico', 'Dicas práticas para diminuir o uso de plásticos descartáveis no seu dia a dia e adotar alternativas sustentáveis.', '/placeholder.svg');

INSERT INTO public.challenges (challenge, is_fixed) VALUES
('Use uma garrafa reutilizável em vez de garrafas plásticas descartáveis', true),
('Separe corretamente o lixo reciclável do orgânico', true),
('Desligue aparelhos eletrônicos da tomada quando não estiver usando', true),
('Use sacolas reutilizáveis para fazer compras', true),
('Evite desperdício de comida planejando suas refeições', true),
('Caminhe ou use bicicleta em vez do carro para trajetos curtos', false),
('Tome banhos mais rápidos para economizar água', false),
('Use papel rascunho antes de descartar documentos', false),
('Prefira produtos com embalagens recicláveis', false),
('Cultive uma pequena horta em casa', false);

INSERT INTO public.quiz_questions (question, options, correct_answer) VALUES
('Qual é o tempo de decomposição de uma garrafa plástica na natureza?', '["10 anos", "50 anos", "100 anos", "450 anos"]', 3),
('Qual material NÃO pode ser reciclado no lixo comum?', '["Papel", "Vidro", "Pilhas e baterias", "Alumínio"]', 2),
('Quantos litros de água são economizados ao reciclar 1 tonelada de papel?', '["1.000 litros", "10.000 litros", "26.000 litros", "50.000 litros"]', 2);

INSERT INTO public.collection_points (name, address, waste_types) VALUES
('EcoPonto Central', 'Rua das Flores, 123 - Centro', '["Papel", "Plástico", "Vidro", "Metal"]'),
('Coleta Verde Norte', 'Av. Sustentável, 456 - Zona Norte', '["Eletrônicos", "Pilhas", "Baterias"]'),
('Reciclagem Sul', 'Rua Ecológica, 789 - Zona Sul', '["Papel", "Plástico", "Óleo de Cozinha"]');

INSERT INTO public.daily_phrases (phrase) VALUES
('🌱 Pequenas ações geram grandes transformações. Comece hoje!'),
('♻️ Reciclar é dar uma segunda chance ao que parecia sem valor.'),
('🌍 Cada gesto sustentável é um voto por um planeta melhor.'),
('💚 A natureza não pertence a nós, nós pertencemos à natureza.'),
('🌿 Sustentabilidade é pensar no amanhã, agindo hoje.'),
('🔄 Reduzir, reutilizar, reciclar: o ciclo da consciência ambiental.'),
('🌎 Não herdamos a Terra de nossos pais, a tomamos emprestada de nossos filhos.');

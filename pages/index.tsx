import { useMemo, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PlaceIcon from '@mui/icons-material/Place';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import StarRateIcon from '@mui/icons-material/StarRate';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SellIcon from '@mui/icons-material/Sell';
import DescriptionIcon from '@mui/icons-material/Description';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Fab,
  GlobalStyles,
  Grid,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';

type CatalogKey = 'marcos-opticos' | 'lentes-sol' | 'cristales-opticos' | 'lentes-ninos';

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  features: string[];
};

type CatalogModule = {
  key: CatalogKey;
  name: string;
  category: string;
  description: string;
  image: string;
};

type CartItem = Product & { qty: number };

const WHATSAPP_NUMBER = '56932271822';
const INSTAGRAM_URL = 'https://www.instagram.com/optica.multivision_lascondes/';
const STORE_ADDRESS = 'Gilberto Fuenzalida 185, local 119 segundo piso, Las Condes, Chile';
const GOOGLE_MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(STORE_ADDRESS)}&output=embed`;
const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;

const catalogModules: CatalogModule[] = [
  {
    key: 'marcos-opticos',
    name: 'Marcos ópticos',
    category: 'Óptica diaria',
    description: 'Diseños modernos, cómodos y versátiles para toda la familia.',
    image: '/assets/images/catalog/modulo-marcos-opticos.svg',
  },
  {
    key: 'cristales-opticos',
    name: 'Cristales ópticos',
    category: 'Tecnología visual',
    description: 'Cristales monofocales, multifocales, filtro azul y fotocromáticos.',
    image: '/assets/images/catalog/modulo-cristales-opticos.svg',
  },
  {
    key: 'lentes-sol',
    name: 'Lentes',
    category: 'Modelos destacados',
    description: 'Lentes ópticos, solares y opciones para niños.',
    image: '/assets/images/catalog/modulo-lentes-sol.svg',
  },
];
const catalogProducts: Record<CatalogKey, Product[]> = {
  'marcos-opticos': [
    ['Marco rectangular clásico', 'Diseño sobrio para oficina, estudio y uso diario.', ['Formato rectangular', 'Liviano y cómodo', 'Ideal para cristales ópticos'], 1],
    ['Marco redondo moderno', 'Estilo actual para quienes buscan una imagen más suave y juvenil.', ['Formato redondo', 'Look urbano', 'Compatible con filtro azul'], 2],
    ['Marco cuadrado ejecutivo', 'Montura firme, elegante y fácil de combinar.', ['Diseño profesional', 'Buena cobertura visual', 'Uso adulto unisex'], 3],
    ['Marco cat eye femenino', 'Modelo levantado y estilizado, muy usado en tendencia óptica.', ['Estilo cat eye', 'Elegante y moderno', 'Alta presencia visual'], 4],
    ['Marco metálico liviano', 'Alternativa delgada y cómoda para largas jornadas.', ['Estructura metálica', 'Muy liviano', 'Estilo minimalista'], 5],
    ['Marco transparente', 'Tendencia limpia y luminosa para rostros jóvenes y adultos.', ['Acetato transparente', 'Look moderno', 'Fácil de combinar'], 6],
    ['Marco azul urbano', 'Color moderno para dar carácter sin perder formalidad.', ['Color azul', 'Formato versátil', 'Uso diario'], 7],
    ['Marco negro grueso', 'Montura con presencia, inspirada en estilos clásicos de moda.', ['Acetato negro', 'Alta resistencia', 'Diseño atemporal'], 8],
    ['Marco semi al aire', 'Diseño liviano con una apariencia discreta y profesional.', ['Semi al aire', 'Peso reducido', 'Imagen elegante'], 9],
    ['Marco flexible diario', 'Opción cómoda para personas activas que usan lentes todo el día.', ['Material flexible', 'Cómodo', 'Buena durabilidad'], 10],
  ].map(([name, description, features, number]) => ({
    id: Number(number),
    name: String(name),
    category: 'Marcos ópticos',
    description: String(description),
    features: features as string[],
    image: `/assets/images/catalog/marco-optico-${number}.svg`,
  })),
  'lentes-sol': [
    ['Ray-Ban Aviador clásico', 'Formato aviador de inspiración icónica, elegante y atemporal.', ['Estilo aviador', 'Protección UV', 'Adulto unisex'], 11],
    ['Ray-Ban Wayfarer urbano', 'Silueta cuadrada reconocida por su estilo casual y moderno.', ['Estilo wayfarer', 'Alta presencia', 'Uso diario'], 12],
    ['Lente de sol redondo vintage', 'Modelo redondo para una estética retro y liviana.', ['Formato redondo', 'Look vintage', 'Protección solar'], 13],
    ['Lente de sol polarizado', 'Pensado para manejar, playa o situaciones con reflejos fuertes.', ['Polarizado', 'Menos reflejos', 'Mayor contraste'], 14],
    ['Lente deportivo envolvente', 'Mayor cobertura para actividades al aire libre.', ['Diseño deportivo', 'Cobertura amplia', 'Cómodo'], 15],
    ['Lente de sol oversize', 'Formato grande, elegante y de alta cobertura.', ['Formato grande', 'Moda femenina', 'Protección UV'], 16],
    ['Lente de sol cuadrado premium', 'Diseño sobrio y moderno para uso diario.', ['Formato cuadrado', 'Estilo premium', 'Unisex'], 17],
    ['Lente de sol degradé', 'Cristal degradado para una estética suave y sofisticada.', ['Cristal degradé', 'Look elegante', 'Protección solar'], 18],
    ['Lente de sol espejado', 'Cristales reflectantes para estilo deportivo y urbano.', ['Cristal espejado', 'Diseño llamativo', 'Uso exterior'], 19],
    ['Lente de sol clásico negro', 'Opción versátil, simple y combinable con todo.', ['Color negro', 'Diseño atemporal', 'Uso diario'], 20],
  ].map(([name, description, features, number]) => ({
    id: Number(number),
    name: String(name),
    category: 'Lentes de sol',
    description: String(description),
    features: features as string[],
    image: `/assets/images/catalog/lente-sol-${Number(number) - 10}.svg`,
  })),
  'cristales-opticos': [
    ['Cristal monofocal', 'Para corregir una sola distancia: lejos, cerca o intermedia.', ['Según receta', 'Uso diario', 'Alta nitidez'], 21],
    ['Cristal bifocal', 'Alternativa con dos zonas de visión en un mismo lente.', ['Dos distancias', 'Lectura y lejos', 'Solución práctica'], 22],
    ['Cristal multifocal progresivo', 'Permite ver de lejos, intermedio y cerca sin línea visible.', ['Visión progresiva', 'Sin línea marcada', 'Uso adulto'], 23],
    ['Cristal con filtro azul', 'Pensado para usuarios de computador, celular y pantallas.', ['Filtro azul', 'Uso digital', 'Confort visual'], 24],
    ['Cristal antirreflejo', 'Reduce reflejos molestos y mejora la calidad visual.', ['Menos reflejos', 'Mejor transparencia', 'Uso diario'], 25],
    ['Cristal fotocromático', 'Se oscurece con luz exterior y vuelve claro en interiores.', ['Se adapta a la luz', 'Interior/exterior', 'Muy práctico'], 26],
    ['Cristal de alto índice', 'Recomendado para recetas altas, con menor grosor.', ['Más delgado', 'Recetas altas', 'Mejor estética'], 27],
    ['Cristal policarbonato', 'Material resistente, recomendado para niños y deporte.', ['Alta resistencia', 'Liviano', 'Seguro'], 28],
    ['Cristal polarizado con receta', 'Combina receta óptica con reducción de reflejos solares.', ['Con receta', 'Polarizado', 'Uso exterior'], 29],
    ['Cristal ocupacional', 'Orientado a trabajo de oficina y distancias intermedias.', ['Oficina', 'Pantallas', 'Confort laboral'], 30],
  ].map(([name, description, features, number]) => ({
    id: Number(number),
    name: String(name),
    category: 'Cristales ópticos',
    description: String(description),
    features: features as string[],
    image: `/assets/images/catalog/cristal-optico-${Number(number) - 20}.svg`,
  })),
  'lentes-ninos': [
    ['Marco infantil flexible', 'Pensado para niños activos que requieren mayor resistencia.', ['Flexible', 'Uso escolar', 'Cómodo'], 31],
    ['Marco infantil rectangular', 'Diseño simple y cómodo para uso diario en clases.', ['Rectangular', 'Liviano', 'Uso diario'], 32],
    ['Marco infantil redondo', 'Estilo suave y moderno para rostros pequeños.', ['Redondo', 'Diseño infantil', 'Cómodo'], 33],
    ['Marco escolar resistente', 'Montura pensada para golpes menores y uso frecuente.', ['Resistente', 'Escolar', 'Durable'], 34],
    ['Marco infantil azul', 'Color entretenido y fácil de usar para niños.', ['Color azul', 'Liviano', 'Uso diario'], 35],
    ['Marco infantil rosado', 'Opción colorida, cómoda y atractiva para niñas y niños.', ['Color rosado', 'Flexible', 'Cómodo'], 36],
    ['Marco con plaquetas suaves', 'Mejor ajuste nasal para mayor comodidad.', ['Plaquetas suaves', 'Buen ajuste', 'Liviano'], 37],
    ['Marco infantil deportivo', 'Diseño seguro para juegos y movimiento.', ['Deportivo', 'Seguro', 'Alta sujeción'], 38],
    ['Marco infantil transparente', 'Tendencia moderna en versión pequeña.', ['Transparente', 'Moderno', 'Liviano'], 39],
    ['Marco infantil con cristales policarbonato', 'Combinación recomendada para mayor seguridad.', ['Policarbonato', 'Seguro', 'Resistente'], 40],
  ].map(([name, description, features, number]) => ({
    id: Number(number),
    name: String(name),
    category: 'Lentes para niños',
    description: String(description),
    features: features as string[],
    image: `/assets/images/catalog/lente-nino-${Number(number) - 30}.svg`,
  })),
};

const promotions = [
  'Promociones en marcos ópticos seleccionados',
  'Consulta por cristales con filtro azul',
  'Cotización rápida por WhatsApp',
];

const informationItems = [
  {
    title: 'Entregas en 1 Hora',
    icon: AccessTimeIcon,
    description:
      'Contamos con equipamiento especializado y procesos ágiles para preparar una amplia variedad de lentes ópticos en tiempos reducidos. Presenta tu receta y consulta por las alternativas disponibles para entrega el mismo día.',
  },
  {
    title: 'Reparaciones',
    icon: BuildCircleIcon,
    description:
      'Realizamos ajustes, mantenciones, cambios de tornillos, plaquetas y revisión general de marcos. Evaluamos cada caso para orientarte con una solución rápida, segura y conveniente.',
  },
  {
    title: 'Valoración de Google',
    icon: StarRateIcon,
    description:
      'Nuestros clientes destacan la atención cercana, la rapidez en la entrega y la buena asesoría al elegir sus lentes. Comentarios frecuentes: “excelente atención”, “muy rápidos” y “gran variedad de marcos”.',
  },
  {
    title: 'Servicios',
    icon: VisibilityIcon,
    description:
      'Te acompañamos desde la elección del marco hasta la entrega final de tus lentes. Ofrecemos orientación personalizada en cristales ópticos, lentes de sol, marcos para niños y soluciones para uso diario o laboral.',
  },
  {
    title: 'Valores',
    icon: SellIcon,
    description:
      'Trabajamos con alternativas para distintos presupuestos, cuidando siempre la calidad, comodidad y estética. Te ayudamos a encontrar una solución visual acorde a tu receta, necesidad y estilo.',
  },
  {
    title: 'Información de Reembolso',
    icon: DescriptionIcon,
    description:
      'Entregamos la documentación necesaria para facilitar solicitudes de reembolso en Isapres, seguros complementarios u otros convenios. Nuestro equipo puede orientarte sobre los antecedentes requeridos.',
  },
];

const googleReviews = [
  {
    name: 'Camila R.',
    date: 'Hace 2 semanas',
    initials: 'CR',
    comment:
      'Excelente atención. Me asesoraron con mucha paciencia para elegir mis marcos y la entrega fue muy rápida.',
  },
  {
    name: 'Jorge M.',
    date: 'Hace 1 mes',
    initials: 'JM',
    comment:
      'Muy buena experiencia. Tienen gran variedad de lentes y explican súper bien las opciones de cristales.',
  },
  {
    name: 'Valentina P.',
    date: 'Hace 3 semanas',
    initials: 'VP',
    comment:
      'Fui con mi receta y me ayudaron de inmediato. Atención cercana, buenos modelos y excelente disposición.',
  },
  {
    name: 'Rodrigo S.',
    date: 'Hace 2 meses',
    initials: 'RS',
    comment:
      'Repararon mis lentes y quedaron perfectos. Muy recomendable por rapidez, trato amable y preocupación.',
  },
];

export default function HomePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogModule | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const currentProducts = selectedCatalog ? catalogProducts[selectedCatalog.key] : [];

  const addToCart = (product: Product) => {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      if (found) {
        return current.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...current, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const sendCartToWhatsApp = () => {
    const productText = cart.length
      ? cart.map((item) => `• ${item.name} (${item.category}) x${item.qty}`).join('\n')
      : 'Quiero hacer una consulta general.';

    const message = `Hola, me interesa cotizar en Óptica Multivision Las Condes:\n\n${productText}\n\nMi nombre es:`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendContactToWhatsApp = () => {
    const message = `Hola, soy ${contactName || 'cliente'}.\n\n${contactMessage || 'Quiero hacer una consulta.'}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <Head>
        <title>Óptica Multivision Las Condes</title>
        <meta
          name="description"
          content="Óptica Multivision Las Condes: catálogo visual, promociones, contacto y cotización directa por WhatsApp."
        />
      </Head>

      <GlobalStyles
        styles={{
          html: { scrollBehavior: 'smooth' },
          body: {
            background: 'linear-gradient(180deg, #f4fbff 0%, #e7f7ff 45%, #f8fdff 100%)',
          },
        }}
      />

      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar sx={{ gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Box sx={{ position: 'relative', width: { xs: 54, sm: 64 }, height: { xs: 54, sm: 64 }, flexShrink: 0 }}>
              <Image
                src="/assets/images/optica-multivision-logo.png"
                alt="Logo Óptica Multivision Las Condes"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
            <Typography variant="h6" fontWeight={900} sx={{ display: { xs: 'none', sm: 'block' } }}>
              Óptica Multivision Las Condes
            </Typography>
          </Box>
          <Button href="#informacion" sx={{ display: { xs: 'none', md: 'inline-flex' } }}>Información</Button>
          <Button href="#catalogo" sx={{ display: { xs: 'none', md: 'inline-flex' } }}>Catálogo</Button>
          <Button href="#contacto" sx={{ display: { xs: 'none', md: 'inline-flex' } }}>Contacto</Button>
          <IconButton onClick={() => setDrawerOpen(true)} aria-label="Abrir carrito">
            <Badge badgeContent={totalItems} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ background: 'linear-gradient(180deg, #dff4ff 0%, #eef9ff 100%)' }}>
        <Box
          sx={{
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#e7f7ff',
          }}
        >
          <Image
            src="/assets/images/portada-optica.jpeg"
            alt="Fachada Óptica Multivision Las Condes"
            width={1600}
            height={900}
            priority
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </Box>

        <Container sx={{ mt: { xs: 3, md: 4 }, position: 'relative', zIndex: 2, pb: { xs: 6, md: 8 } }}>
          <Card
            sx={{
              maxWidth: 980,
              mx: 'auto',
              borderRadius: 5,
              px: { xs: 3, md: 6 },
              py: { xs: 4, md: 5 },
              textAlign: 'center',
              boxShadow: '0 24px 70px rgba(15, 23, 42, 0.18)',
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Chip label="Cotiza directo por WhatsApp" color="primary" sx={{ mb: 2 }} />
            <Typography variant="h2" component="h1" fontWeight={900} lineHeight={1.05}>
              Más que lentes, cuidamos tu visión.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
              Descubre la mejor atención y amplia variedad de marcos para toda la familia.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button variant="contained" size="large" startIcon={<WhatsAppIcon />} onClick={sendCartToWhatsApp}>
                Cotización WhatsApp
              </Button>
              <Button variant="outlined" size="large" href={INSTAGRAM_URL} target="_blank" startIcon={<InstagramIcon />}>
                Instagram
              </Button>
            </Stack>
          </Card>
        </Container>
      </Box>

      <Container id="informacion" sx={{ py: 7 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <LocalOfferIcon color="primary" />
          <Typography variant="h4" fontWeight={900}>Información</Typography>
        </Stack>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 820 }}>
          Atención cercana, soluciones rápidas y asesoría personalizada para cuidar tu visión y la de tu familia.
        </Typography>
        <Grid container spacing={3}>
          {informationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Grid item xs={12} sm={6} md={4} key={item.title}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.92)',
                    border: '1px solid rgba(56, 189, 248, 0.18)',
                    boxShadow: '0 16px 42px rgba(15, 23, 42, 0.08)',
                    transition: 'all .25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 22px 52px rgba(15, 23, 42, 0.13)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        color: 'primary.main',
                        background: 'linear-gradient(135deg, #e0f7ff 0%, #f2fbff 100%)',
                      }}
                    >
                      <Icon fontSize="medium" />
                    </Box>
                    <Typography variant="h6" fontWeight={900} sx={{ mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary" lineHeight={1.7}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

<Box id="catalogo" sx={{ bgcolor: 'rgba(231, 247, 255, 0.72)', py: 7 }}>
        <Container>
          <Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>Catálogo Visual</Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Explora nuestros módulos visuales y descubre distintos estilos y soluciones ópticas.
          </Typography>
          <Grid container spacing={3}>
            {catalogModules.map((module) => (
              <Grid item xs={12} sm={6} md={3} key={module.key}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all .25s ease',
                    '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 45px rgba(15,23,42,.14)' },
                  }}
                  onClick={() => setSelectedCatalog(module)}
                >
                  <CardMedia sx={{ height: 190, backgroundSize: 'cover' }} image={module.image} title={module.name} />
                  <CardContent>
                    <Chip label={module.category} size="small" sx={{ mb: 1 }} />
                    <Typography variant="h6" fontWeight={800}>{module.name}</Typography>
                    <Typography color="text.secondary" sx={{ minHeight: 72, mt: 1 }}>{module.description}</Typography>
                    <Button fullWidth variant="contained" endIcon={<ArrowForwardIcon />} sx={{ mt: 2 }}>
                      Ver productos
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                component="a"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  height: '100%',
                  minHeight: 360,
                  borderRadius: 4,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  bgcolor: 'white',
                  color: 'text.primary',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all .25s ease',
                  '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 45px rgba(15,23,42,.18)' },
                  '&:hover .catalogo-instagram-img': { transform: 'scale(1.04)', filter: 'brightness(1.06)' },
                }}
              >
                <CardContent sx={{ pb: 1.5 }}>
                  <Typography variant="h5" fontWeight={900} sx={{ color: 'primary.main' }}>
                    Catálogo
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1, fontWeight: 600 }}>
                    Para revisar más modelos haz click aquí
                  </Typography>
                </CardContent>
                <Box sx={{ px: 2, pb: 2, flexGrow: 1, display: 'flex' }}>
                  <Box
                    className="catalogo-instagram-img"
                    sx={{
                      width: '100%',
                      minHeight: 215,
                      borderRadius: 3,
                      backgroundImage: 'url(/assets/images/catalog/catalogo-instagram-lentes.jpeg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.35)',
                      transition: 'all .25s ease',
                    }}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ background: 'linear-gradient(180deg, #f8fdff 0%, #eef9ff 100%)', py: 7 }}>
        <Container>
          <Stack alignItems="center" textAlign="center" sx={{ mb: 4 }}>
            <Chip label="Reseñas de Google" color="primary" variant="outlined" sx={{ mb: 1.5, fontWeight: 700 }} />
            <Typography variant="h4" fontWeight={900}>
              Opiniones de nuestros clientes
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 720 }}>
              Clientes que valoran nuestra atención, rapidez y variedad de soluciones ópticas.
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {googleReviews.map((review) => (
              <Grid item xs={12} sm={6} md={3} key={review.name}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.96)',
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    boxShadow: '0 16px 42px rgba(15, 23, 42, 0.08)',
                    transition: 'all .25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 22px 52px rgba(15, 23, 42, 0.13)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 900 }}>{review.initials}</Avatar>
                      <Box>
                        <Typography fontWeight={900}>{review.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{review.date}</Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={0.25} sx={{ color: '#fbbc04', mb: 1.5 }} aria-label="5 estrellas">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarRateIcon key={star} fontSize="small" />
                      ))}
                    </Stack>
                    <Typography color="text.secondary" lineHeight={1.7}>
                      “{review.comment}”
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, fontWeight: 800, color: 'primary.main' }}>
                      Reseña de Google
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container id="contacto" sx={{ py: 7 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <MailOutlineIcon color="primary" />
              <Typography variant="h4" fontWeight={900}>Contacto</Typography>
            </Stack>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Completa el mensaje y se abrirá WhatsApp con tu consulta lista para enviar.
            </Typography>
            <Stack spacing={2}>
              <TextField label="Nombre" value={contactName} onChange={(event) => setContactName(event.target.value)} fullWidth />
              <TextField label="Mensaje" value={contactMessage} onChange={(event) => setContactMessage(event.target.value)} multiline rows={4} fullWidth />
              <Button variant="contained" size="large" startIcon={<WhatsAppIcon />} onClick={sendContactToWhatsApp}>
                Enviar consulta por WhatsApp
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <PlaceIcon color="primary" />
              <Typography variant="h4" fontWeight={900}>Ubicación</Typography>
            </Stack>
            <Box sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
              <iframe src={GOOGLE_MAPS_EMBED} width="100%" height="330" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </Box>
            <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mt: 2.5 }}>
              <PlaceIcon color="primary" sx={{ mt: 0.35 }} />
              <Typography variant="h6" fontWeight={900} lineHeight={1.25}>
                {STORE_ADDRESS}
              </Typography>
            </Stack>
            <Button href={GOOGLE_MAPS_LINK} target="_blank" sx={{ mt: 2 }} startIcon={<PlaceIcon />}>
              Abrir en Google Maps
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Box component="footer" sx={{ bgcolor: '#111827', color: 'white', py: 4 }}>
        <Container>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
            <Box>
              <Typography fontWeight={900}>Óptica Multivision Las Condes</Typography>
              <Typography variant="body2" sx={{ opacity: 0.75 }}>Tu visión, nuestra misión.</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button color="inherit" href={INSTAGRAM_URL} target="_blank" startIcon={<InstagramIcon />}>Instagram</Button>
              <Button color="inherit" onClick={sendCartToWhatsApp} startIcon={<WhatsAppIcon />}>WhatsApp</Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Fab color="success" onClick={sendCartToWhatsApp} sx={{ position: 'fixed', right: 24, bottom: 24 }} aria-label="WhatsApp">
        <WhatsAppIcon />
      </Fab>

      <Dialog open={Boolean(selectedCatalog)} onClose={() => setSelectedCatalog(null)} fullWidth maxWidth="lg">
        <DialogTitle sx={{ pr: 7 }}>
          <Typography variant="h4" component="div" fontWeight={900}>{selectedCatalog?.name}</Typography>
          <Typography color="text.secondary">Artículos referenciales para agregar al carrito y cotizar por WhatsApp.</Typography>
          <IconButton onClick={() => setSelectedCatalog(null)} sx={{ position: 'absolute', right: 16, top: 16 }} aria-label="Cerrar catálogo">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {currentProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ height: '100%', borderRadius: 4, overflow: 'hidden' }}>
                  <CardMedia sx={{ height: 190, backgroundSize: 'cover' }} image={product.image} title={product.name} />
                  <CardContent>
                    <Chip label={product.category} size="small" color="primary" variant="outlined" sx={{ mb: 1 }} />
                    <Typography variant="h6" fontWeight={900}>{product.name}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, minHeight: 54 }}>{product.description}</Typography>
                    <Box component="ul" sx={{ pl: 2.4, my: 2, color: 'text.secondary' }}>
                      {product.features.map((feature) => (
                        <li key={feature}><Typography variant="body2">{feature}</Typography></li>
                      ))}
                    </Box>
                    <Button fullWidth variant="contained" startIcon={<ShoppingCartIcon />} onClick={() => addToCart(product)}>
                      Agregar al carrito
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDrawerOpen(true)} startIcon={<ShoppingCartIcon />}>
            Ver carrito ({totalItems})
          </Button>
          <Button variant="contained" color="success" startIcon={<WhatsAppIcon />} onClick={sendCartToWhatsApp}>
            Cotizar por WhatsApp
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: { xs: 320, sm: 390 }, p: 3 }}>
          <Typography variant="h5" fontWeight={900}>Carrito de cotización</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No hay pago online. Esto solo prepara el mensaje para WhatsApp.
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {cart.length === 0 ? (
            <Typography color="text.secondary">Tu carrito está vacío.</Typography>
          ) : (
            <Stack spacing={2}>
              {cart.map((item) => (
                <Card key={item.id} variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography fontWeight={800}>{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.category}</Typography>
                        <Typography variant="body2" color="text.secondary">Cantidad: {item.qty}</Typography>
                      </Box>
                      <IconButton color="error" onClick={() => removeFromCart(item.id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
              <Button variant="contained" size="large" startIcon={<WhatsAppIcon />} onClick={sendCartToWhatsApp}>
                Enviar carrito por WhatsApp
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </>
  );
}

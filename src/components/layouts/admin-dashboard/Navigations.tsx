import { useRouter } from "next/router";
import { Category, Construction, Image, LocalShipping, Slideshow } from "@mui/icons-material";
// icon components
import Settings from "@mui/icons-material/Settings";
import Dashboard from "@mui/icons-material/Dashboard";
import Assignment from "@mui/icons-material/Assignment";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Pages from "components/icons/Pages";
import User2 from "components/icons/User2";
// custom component
import FlexBox from "components/flex-box/FlexBox";
// styled components
import { NavigationWrapper, DashboardNavItem } from "../styled";

const AdminDashboardNavigation = () => {
  const { pathname } = useRouter();

  return (
    <NavigationWrapper
      sx={{ px: "0px", py: "1.5rem", color: "grey.900", "& a:last-child": { mb: 0 } }}
    >
      {linkList.map(({ title, href, Icon }) => (
        <DashboardNavItem href={href} key={title} isCurrentPath={pathname.includes(href)}>
          <FlexBox alignItems="center" gap={1}>
            <Icon className="nav-icon" fontSize="small" color="inherit" />
            <span>{title}</span>
          </FlexBox>
        </DashboardNavItem>
      ))}
    </NavigationWrapper>
  );
};

const linkList = [
  { href: "/admin/dashboard", title: "Panel", Icon: Dashboard },
  { href: "/admin/products", title: "Productos", Icon: Assignment },
  // { href: "/admin/orders", title: "Ordenes", Icon: ShoppingCart },
  // { href: "/admin/users", title: "Usuarios", Icon: User2 },
  { href: "/admin/site-settings", title: "Configuraciones", Icon: Settings },
  // { href: "/admin/delivery-time", title: "Horarios de entrega", Icon: LocalShipping },

  // { href: "/admin/category-list", title: "Categorias", Icon: Category },
  { href: "/admin/slider", title: "Slider", Icon: Slideshow },
  { href: "/admin/recipes", title: "Recetas", Icon: VisibilityIcon },

  // { href: "/admin/services", title: "Beneficios", Icon: Construction },
  // { href: "/admin/pages", title: "Páginas", Icon: Pages },
  // { href: "/admin/icons", title: "Iconos", Icon: Image },
];

export default AdminDashboardNavigation;

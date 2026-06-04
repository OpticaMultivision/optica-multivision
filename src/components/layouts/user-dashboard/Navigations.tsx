import { useRouter } from "next/router";
import { Lock, CreditCard, Person, Place, ShoppingBagOutlined } from "@mui/icons-material";
// custom components
import { Paragraph } from "components/Typography";
import { FlexItemCenter } from "components/flex-box";
// styled components
import { NavigationWrapper, DashboardNavItem } from "../styled";

const UserDashboardNavigation = () => {
  const { pathname } = useRouter();

  return (
    <NavigationWrapper sx={{ px: 0, pb: 3, color: "grey.900", "& a:last-child": { mb: 0 } }}>
      <Paragraph p="26px 30px 1rem" color="grey.600" fontSize={12}>
        Panel
      </Paragraph>

      {linkList.map(({ href, Icon, title }) => (
        <DashboardNavItem href={href} key={title} isCurrentPath={pathname.includes(href)}>
          <FlexItemCenter gap={1}>
            <Icon color="inherit" fontSize="small" className="nav-icon" />
            <span>{title}</span>
          </FlexItemCenter>
        </DashboardNavItem>
      ))}
    </NavigationWrapper>
  );
};

const linkList = [
  // { href: "/orders", title: "Ordenes", Icon: ShoppingBagOutlined },
  { href: "/profile", title: "Perfil", Icon: Person },
  { href: "/address", title: "Direcciones", Icon: Place },
  // { href: "/payment-methods", title: "Métodos de pago", Icon: CreditCard },
  { href: "/password-change", title: "Cambiar contraseña", Icon: Lock },
];

export default UserDashboardNavigation;

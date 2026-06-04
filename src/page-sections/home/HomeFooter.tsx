import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import Grid from "@mui/material/Grid";
// custom components
import AppStore from "components/AppStore";
import { Paragraph } from "components/Typography";
// custom context
import { useSettingContext } from "contexts/SettingContext";
// custom styled components
import { FooterLink, FooterWrapper } from "./styled";
import MapComponent from "components/map";

const HomeFooter: FC = () => {
  const { footerSetting } = useSettingContext();

  return (
    <FooterWrapper>
      <Grid container spacing={1}>
        <Grid item md={6} sm={6} xs={12}>
          <Link href="/">
            <Image
              alt="logo"
              width={150}
              height={110}
              src={footerSetting?.logo?.location}
              style={{ objectFit: "contain" }}
            />
          </Link>
        </Grid>

        <Grid item md={6} sm={6} xs={12}>
          <Paragraph mb={2.5} color="grey.100" maxWidth="370px">
            {footerSetting?.description}
          </Paragraph>

          {/* <AppStore /> */} 
       </Grid>

       <Grid item md={12} sm={12} xs={12}>
        <MapComponent lat={'-33.389990'} lng={'-70.544470'} />
        </Grid>
      </Grid>
    </FooterWrapper>
  );
};

export default HomeFooter;

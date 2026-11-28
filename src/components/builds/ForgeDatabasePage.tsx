import ForgeDatabase from "./ForgeDatabase";
import catalog from "../../../content/forge/public-catalog.json";
import {parsePublicCatalog} from "@/lib/forge-catalog";
import type {Locale} from "@/lib/i18n";
export default function ForgeDatabasePage({locale}:{locale:Locale}){return <ForgeDatabase locale={locale} entries={parsePublicCatalog(catalog)}/>}

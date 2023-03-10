import { BaseModel } from "src/app/shared/crud-table";

export interface IVariant {
    "id": string
    "gene": string
    "transcript_id": string
    "position": number
    "chrom": string
    "rsid": string
    "REF": string
    "ALT": string
    "cnomen": string
    "pnomen": string
    "function": string
    "location": string
    "coverage": string
    "gnomad": string
    "gnomad_ALL": string
    "cosmicID": string
    "classification": string
    "clinvar": string
    "gnomAD_AFR": string
    "gnomAD_AMR": string
    "Consequence": string
    "EXON": string
    "INTRON": string
    "DOMAINS": string
    "gnomAD_genome_AMR": string
    "gnomADe_AMR": string
    "CLINSIG": string
    "NEW_CLINSIG": string
    "CLNACC": string
    "SOMATIC": string
    "cosmics": string
    "SIFT_score": string
    "Polyphen2_HDIV_score": string
    "CADD_PHRED": string
    "PUBMED": string
    "gold_stars": string
    "review_status": string
    "Clinvar_VARIANT_ID": string
    "gene_omim": string
    "GeneSplicer": string
    "gnomADe_AFR": string
    "gnomAD_genome_AFR": string
    "1000g_AFR_AF": string
    "1000g_AMR_AF": string
    "gnomADe_EAS": string
    "gnomAD_genome_EAS": string
    "gnomADe_SAS": string
    "1000g_SAS_AF": string
    "gnomADe_ASJ": string
    "gnomAD_genome_ASJ": string
    "gnomADe_FIN": string
    "gnomAD_genome_FIN": string
    "1000g_EUR_AF": string
    "gnomADe_NFE": string
    "gnomAD_genome_NFE": string
    "gnomADe_OTH": string
    "gnomADe_ALL": string
    "gnomAD_genome_ALL": string
    "1000g_AF": string
    "gnomAD_genome_OTH": string
    "CANONICAL": string
    "1000g_EAS_AF": string
    "HGNC_SYMONYMS": string
    "HGNC_PRE_SYMBOL": string
}

export interface VariantModel extends IVariant {}

export class VariantModel implements IVariant, BaseModel {
}

export interface IVariantFilter {
    chrom?: String[]
    gene?: String[]
    annotation?: String[]
    classification?: String[]
    alleleFrequencyFrom?: number
    alleleFrequencyTo?: number
    gnomADfrom?: number
    gnomADto?: number
    readDepthGreater?: number
    readDepthLower?: number
    function?: String
    qualityGreater?: number
    qualityLower?: number
}

export interface IVariantFilterSelect2 {
    id: string
    text: string
    dad? : string
    items?: string[]
    show: boolean
}

export interface IIgvUrl {
    bamUrl?: string;
    indexBamUrl?: string
}

export interface IGeneDetail {
    name?: string
    full_name?: string
    summary?: string
    GHR_summary?: string
    GHR_metadata?: string
    NCBI_summary?: string
    NCBI_metadata?: string
}
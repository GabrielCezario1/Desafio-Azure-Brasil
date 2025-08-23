export class PaginacaoResponse<T> {
    public total: number;
    public registros: Array<T>;

    constructor(params: Partial<PaginacaoResponse<T>>) {
        this.total = params.total || 0;
        this.registros = params.registros || [];
    }
}
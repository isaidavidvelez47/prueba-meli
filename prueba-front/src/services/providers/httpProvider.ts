interface HttpProvider {
  get<T>(url: string, headers?: Record<string, unknown>): Promise<T>;
  post<T, U>(url: string, body: U, headers?: Record<string, unknown>): Promise<T>;
}

export default HttpProvider;

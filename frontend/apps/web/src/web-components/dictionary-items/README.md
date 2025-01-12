# dictionary-items

`api-fetchers` is for components that make api requests.

The components in `api-fetchers` pass the data to components in `api-result-formatters`, which decide what to display (error, loading, success etc).

If the result formatter decides to display a successful page, it passes the data to the relevant component in `item-components`.

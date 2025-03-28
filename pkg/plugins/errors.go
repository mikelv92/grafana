package plugins

import "github.com/grafana/grafana/pkg/apimachinery/errutil"

var (
	errPluginNotRegisteredBase = errutil.NotFound("plugin.notRegistered",
		errutil.WithPublicMessage("Plugin not registered"))
	// ErrPluginNotRegistered error returned when a plugin is not registered.
	ErrPluginNotRegistered = errPluginNotRegisteredBase.Errorf("plugin not registered")

	errPluginUnavailableBase = errutil.Internal("plugin.unavailable",
		errutil.WithPublicMessage("Plugin unavailable"))
	// ErrPluginUnavailable error returned when a plugin is unavailable.
	ErrPluginUnavailable = errPluginUnavailableBase.Errorf("plugin unavailable")

	errMethodNotImplementedBase = errutil.NotFound("plugin.notImplemented",
		errutil.WithPublicMessage("Method not implemented"))
	// ErrMethodNotImplemented error returned when a plugin method is not implemented.
	ErrMethodNotImplemented = errMethodNotImplementedBase.Errorf("method not implemented")

	// ErrPluginHealthCheck error returned when a plugin fails its health check.
	// Exposed as a base error to wrap it with plugin error.
	ErrPluginHealthCheck = errutil.Internal("plugin.healthCheck",
		errutil.WithPublicMessage("Plugin health check failed"),
		errutil.WithDownstream())

	// ErrPluginRequestFailureErrorBase error returned when a plugin request fails.
	// Exposed as a base error to wrap it with plugin request errors.
	ErrPluginRequestFailureErrorBase = errutil.Internal("plugin.requestFailureError",
		errutil.WithPublicMessage("An error occurred within the plugin"),
		errutil.WithDownstream())

	// ErrPluginRequestCanceledErrorBase error returned when a plugin request
	// is cancelled by the client (context is cancelled).
	// Exposed as a base error to wrap it with plugin cancelled errors.
	ErrPluginRequestCanceledErrorBase = errutil.ClientClosedRequest("plugin.requestCanceled",
		errutil.WithPublicMessage("Plugin request canceled"))

	// ErrPluginGrpcResourceExhaustedBase error returned when a plugin response is larger than the grpc limit.
	// Exposed as a base error to wrap it with plugin resource exhausted errors.
	ErrPluginGrpcResourceExhaustedBase = errutil.Internal("plugin.resourceExhausted",
		errutil.WithPublicMessage("The response is too large. Please try to reduce the time range or narrow down your query to return fewer data points."),
		errutil.WithDownstream())

	// ErrPluginGrpcConnectionUnavailableBase error returned when a plugin connection issue occurs.
	// Exposed as a base error to wrap it with plugin connection issue errors.
	ErrPluginGrpcConnectionUnavailableBase = errutil.Internal("plugin.connectionUnavailable",
		errutil.WithPublicMessage("Data source became unavailable during request. Please try again."),
		errutil.WithDownstream())
)
